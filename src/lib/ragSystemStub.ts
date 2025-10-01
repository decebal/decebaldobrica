// Stub for RAG system to avoid chromadb/langchain build issues
// The real RAG system will be loaded dynamically at runtime

export async function initializeRAG() {
  console.warn('RAG system stub - real RAG not initialized')
  return null
}

export async function queryKnowledgeBase(query: string, limit = 3) {
  console.warn('RAG system stub - returning empty results')
  return []
}

export function buildContext(docs: any[]) {
  return ''
}
