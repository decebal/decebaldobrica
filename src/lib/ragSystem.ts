import { ChromaClient } from 'chromadb';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs';
import path from 'path';

// Initialize ChromaDB client in embedded/persistent mode
// This doesn't require a separate ChromaDB server
// For Vercel, use /tmp as it's the only writable directory
const getChromaPath = () => {
  if (process.env.VERCEL) {
    return '/tmp/chroma_data'
  }
  return process.env.CHROMADB_PATH || './chroma_data'
}

const chromaClient = new ChromaClient({
  path: getChromaPath()
});

const COLLECTION_NAME = 'portfolio_knowledge';

/**
 * Initialize the RAG system and load knowledge base
 */
export async function initializeRAG() {
  try {
    console.log('🔧 Initializing RAG system...');

    // Initialize embeddings with Ollama
    const embeddings = new OllamaEmbeddings({
      model: 'llama3.2:3b',
      baseUrl: 'http://localhost:11434'
    });

    // Get or create collection
    let collection;
    try {
      collection = await chromaClient.getCollection({ name: COLLECTION_NAME });
      console.log('✅ Using existing knowledge base collection');
    } catch (error) {
      collection = await chromaClient.createCollection({
        name: COLLECTION_NAME,
        metadata: { description: 'Portfolio knowledge base for RAG' }
      });
      console.log('✅ Created new knowledge base collection');
    }

    // Load and index knowledge base documents
    await loadKnowledgeBase(collection, embeddings);

    console.log('✅ RAG system initialized successfully');
    return { collection, embeddings };
  } catch (error) {
    console.error('❌ Error initializing RAG system:', error);
    throw error;
  }
}

/**
 * Load markdown files from knowledge base directory
 */
async function loadKnowledgeBase(collection: any, embeddings: OllamaEmbeddings) {
  // Use path.join for Node.js compatibility (works in both ESM and CommonJS)
  const knowledgeBasePath = path.join(process.cwd(), 'src', 'knowledge-base');

  // Check if directory exists
  if (!fs.existsSync(knowledgeBasePath)) {
    console.warn('⚠️  Knowledge base directory not found, skipping indexing');
    return;
  }

  const files = fs.readdirSync(knowledgeBasePath)
    .filter(file => file.endsWith('.md') && file !== 'README.md');

  if (files.length === 0) {
    console.warn('⚠️  No markdown files found in knowledge base');
    return;
  }

  console.log(`📚 Loading ${files.length} knowledge base documents...`);

  // Text splitter for chunking documents
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const allDocuments: Document[] = [];

  // Load each markdown file
  for (const file of files) {
    const filePath = path.join(knowledgeBasePath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const docs = await textSplitter.createDocuments(
      [content],
      [{ source: file, type: 'knowledge_base' }]
    );

    allDocuments.push(...docs);
  }

  console.log(`📄 Split into ${allDocuments.length} chunks`);

  // Generate embeddings for all chunks
  console.log('🔄 Generating embeddings...');
  const texts = allDocuments.map(doc => doc.pageContent);
  const embeddingVectors = await embeddings.embedDocuments(texts);

  // Add to ChromaDB
  const ids = allDocuments.map((_, idx) => `doc_${idx}`);
  const metadatas = allDocuments.map(doc => doc.metadata);

  await collection.add({
    ids,
    embeddings: embeddingVectors,
    documents: texts,
    metadatas
  });

  console.log('✅ Knowledge base indexed successfully');
}

/**
 * Query the knowledge base for relevant information
 */
export async function queryKnowledgeBase(
  query: string,
  collection: any,
  embeddings: OllamaEmbeddings,
  topK: number = 3
): Promise<string[]> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);

    // Search for similar documents
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK
    });

    // Extract and return the relevant documents
    if (results.documents && results.documents[0]) {
      return results.documents[0];
    }

    return [];
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    return [];
  }
}

/**
 * Build context from retrieved documents
 */
export function buildContext(documents: string[]): string {
  if (documents.length === 0) {
    return 'No relevant information found in knowledge base.';
  }

  return `
Based on the portfolio knowledge base, here is relevant information:

${documents.map((doc, idx) => `[${idx + 1}] ${doc}`).join('\n\n')}

Use this information to answer the user's question accurately.
  `.trim();
}
