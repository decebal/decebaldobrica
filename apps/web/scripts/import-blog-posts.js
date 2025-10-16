#!/usr/bin/env node

/**
 * Import blog posts from decebalonprogramming repository
 * Converts post.js + document.mdx to frontmatter MDX files
 */

const fs = require('node:fs')
const path = require('node:path')

const SOURCE_DIR = path.join(__dirname, '../../decebalonprogramming/src/routes/posts')
const DEST_DIR = path.join(__dirname, '../content/blog')

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true })
}

// Function to parse post.js file
function parsePostMetadata(postJsContent) {
  try {
    // Extract values using regex
    const titleMatch = postJsContent.match(/title:\s*`([^`]+)`/)
    const authorMatch = postJsContent.match(/author:\s*"([^"]+)"/)
    const spoilerMatch = postJsContent.match(/spoiler:\s*"([^"]+)"/)
    const dateMatch = postJsContent.match(/date:\s*new Date\("([^"]+)"\)/)
    const tagsMatch = postJsContent.match(/tags:\s*\[([^\]]+)\]/)

    const title = titleMatch ? titleMatch[1] : 'Untitled'
    const author = authorMatch ? authorMatch[1] : 'Decebal Dobrica'
    const description = spoilerMatch ? spoilerMatch[1] : ''
    const date = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString()

    let tags = []
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map((tag) => tag.trim().replace(/['"]/g, ''))
        .filter(Boolean)
    }

    return { title, author, description, date, tags }
  } catch (error) {
    console.error('Error parsing metadata:', error)
    return null
  }
}

// Function to create frontmatter MDX file
function createFrontmatterMDX(metadata, content, slug) {
  const frontmatter = `---
title: "${metadata.title.replace(/"/g, '\\"')}"
date: "${metadata.date}"
author: "${metadata.author}"
description: "${metadata.description.replace(/"/g, '\\"')}"
tags: [${metadata.tags.map((tag) => `"${tag}"`).join(', ')}]
slug: "${slug}"
---

`

  return frontmatter + content
}

// Main import function
function importBlogPosts() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  const postDirs = fs.readdirSync(SOURCE_DIR).filter((item) => {
    const itemPath = path.join(SOURCE_DIR, item)
    return fs.statSync(itemPath).isDirectory()
  })

  console.log(`Found ${postDirs.length} potential blog post directories`)

  let importedCount = 0
  let skippedCount = 0

  for (const dir of postDirs) {
    const postJsPath = path.join(SOURCE_DIR, dir, 'post.js')
    const documentPath = path.join(SOURCE_DIR, dir, 'document.mdx')

    // Check if both required files exist
    if (!fs.existsSync(postJsPath) || !fs.existsSync(documentPath)) {
      console.log(`Skipping ${dir} - missing required files`)
      skippedCount++
      continue
    }

    try {
      // Read and parse metadata
      const postJsContent = fs.readFileSync(postJsPath, 'utf-8')
      const metadata = parsePostMetadata(postJsContent)

      if (!metadata) {
        console.error(`Failed to parse metadata for ${dir}`)
        skippedCount++
        continue
      }

      // Read content
      const content = fs.readFileSync(documentPath, 'utf-8')

      // Create slug from directory name
      const slug = dir

      // Create frontmatter MDX
      const mdxWithFrontmatter = createFrontmatterMDX(metadata, content, slug)

      // Write to destination
      const destPath = path.join(DEST_DIR, `${slug}.mdx`)
      fs.writeFileSync(destPath, mdxWithFrontmatter, 'utf-8')

      console.log(`✓ Imported: ${slug}`)
      importedCount++
    } catch (error) {
      console.error(`Error importing ${dir}:`, error.message)
      skippedCount++
    }
  }

  console.log('\nImport complete!')
  console.log(`Imported: ${importedCount} posts`)
  console.log(`Skipped: ${skippedCount} posts`)
}

// Run the import
importBlogPosts()
