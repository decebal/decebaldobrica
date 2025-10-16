/**
 * Script to add canonicalUrl to all imported blog posts
 * Run with: node scripts/add-canonical-urls.js
 */

const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')

const BLOG_CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog')
const OLD_BLOG_BASE_URL = 'https://decebalonprogramming.net/post'

// Get all MDX files
const files = fs.readdirSync(BLOG_CONTENT_DIR).filter((file) => file.endsWith('.mdx'))

console.log(`Found ${files.length} blog posts`)

let updated = 0
let skipped = 0

for (const file of files) {
  const filePath = path.join(BLOG_CONTENT_DIR, file)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  // Skip if already has canonicalUrl
  if (data.canonicalUrl) {
    console.log(`⏭️  Skipping ${file} - already has canonicalUrl`)
    skipped++
    continue
  }

  // Construct canonical URL using the slug
  const slug = data.slug || file.replace('.mdx', '')
  const canonicalUrl = `${OLD_BLOG_BASE_URL}/${slug}`

  // Add canonicalUrl to frontmatter
  data.canonicalUrl = canonicalUrl

  // Reconstruct the MDX file with updated frontmatter
  const updatedContent = matter.stringify(content, data)

  // Write back to file
  fs.writeFileSync(filePath, updatedContent, 'utf-8')

  console.log(`✅ Updated ${file} - added canonical URL: ${canonicalUrl}`)
  updated++
}

console.log('\n📊 Summary:')
console.log(`   Updated: ${updated}`)
console.log(`   Skipped: ${skipped}`)
console.log(`   Total: ${files.length}`)
