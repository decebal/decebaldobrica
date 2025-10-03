# Knowledge Base

This directory contains markdown files that power the RAG (Retrieval-Augmented Generation) system for the portfolio AI chat.

## How It Works

1. **Indexing**: When the app starts, all `.md` files in this directory are:
   - Split into chunks (500 characters with 50 character overlap)
   - Converted into embeddings using Ollama
   - Stored in ChromaDB for similarity search

2. **Querying**: When users ask questions in the chat:
   - Their question is converted to an embedding
   - ChromaDB finds the most relevant document chunks
   - The AI uses these chunks as context to provide accurate answers

## Files Included

- **about.md** - Information about Decebal Dobrica (background, achievements, philosophy)
- **services.md** - Detailed service offerings and engagement models
- **expertise.md** - Technical skills, proven results, and technologies
- **case-studies.md** - Success stories and project outcomes
- **meeting-info.md** - Meeting types, availability, and booking information

## Adding New Documents

To add new knowledge:

1. Create a new `.md` file in this directory
2. Write content in markdown format
3. Restart the application to re-index

**Note**: The `README.md` file is automatically excluded from indexing.

## ChromaDB Storage

The vector embeddings are stored in `./chroma_data/` (gitignored). This directory will be created automatically when the RAG system initializes.

## Configuration

- **Chunk size**: 500 characters
- **Chunk overlap**: 50 characters
- **Embedding model**: llama3.2:3b (via Ollama)
- **Top-K results**: 3 most relevant chunks per query
- **Storage**: Embedded ChromaDB (no server required)
