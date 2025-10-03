#!/bin/bash
# Railway initialization script - pulls required Ollama models

echo "🚀 Initializing Ollama on Railway..."

# Wait for Ollama to start
sleep 5

# Pull required models
echo "📥 Pulling llama3.2:3b model..."
ollama pull llama3.2:3b

echo "📥 Pulling nomic-embed-text model..."
ollama pull nomic-embed-text

echo "✅ Ollama models ready!"
