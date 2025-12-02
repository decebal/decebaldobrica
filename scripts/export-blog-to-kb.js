#!/usr/bin/env node

/**
 * Export Blog Posts to Knowledge Base
 *
 * This script copies all blog posts from apps/web/content/blog/ to knowledge-base/blog-posts/
 * for use with AnythingLLM RAG system.
 */

const fs = require('fs')
const path = require('path')

const BLOG_DIR = path.join(__dirname, '../apps/web/content/blog')
const KB_DIR = path.join(__dirname, '../knowledge-base/blog-posts')

// Ensure knowledge base directory exists
if (!fs.existsSync(KB_DIR)) {
  fs.mkdirSync(KB_DIR, { recursive: true })
  console.log(`✅ Created knowledge base directory: ${KB_DIR}`)
}

// Read all blog post files
const blogFiles = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'))

console.log(`📚 Found ${blogFiles.length} blog posts to export\n`)

let exported = 0
const skipped = 0
let errors = 0

for (const file of blogFiles) {
  try {
    const sourcePath = path.join(BLOG_DIR, file)
    const destPath = path.join(KB_DIR, file.replace('.mdx', '.md')) // Convert to .md for AnythingLLM

    // Read the file content
    const content = fs.readFileSync(sourcePath, 'utf-8')

    // Write to knowledge base
    fs.writeFileSync(destPath, content)

    exported++
    console.log(`✅ Exported: ${file}`)
  } catch (error) {
    errors++
    console.error(`❌ Error exporting ${file}:`, error.message)
  }
}

console.log(`\n📊 Export Summary:`)
console.log(`   Exported: ${exported}`)
console.log(`   Skipped: ${skipped}`)
console.log(`   Errors: ${errors}`)
console.log(`\n✅ Blog posts exported to: ${KB_DIR}`)
console.log(`\n📌 Next Steps:`)
console.log(`   1. Start AnythingLLM: docker compose -f docker-compose.anythingllm.yml up -d`)
console.log(`   2. Access UI: http://localhost:3102`)
console.log(`   3. Create workspace: "Leadership Blog Content"`)
console.log(`   4. Upload documents from knowledge-base/ directory`)
console.log(`   5. Start generating content with your own writing style!`)
