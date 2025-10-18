FROM mintplexlabs/anythingllm:latest

# Set environment variables
ENV NODE_ENV=production
ENV STORAGE_DIR=/app/server/storage
ENV SERVER_PORT=3000

# Create storage directory
RUN mkdir -p /app/server/storage

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server/index.js"]
