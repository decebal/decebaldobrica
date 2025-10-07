import fs from 'fs'
import path from 'path'

/**
 * Load all knowledge base markdown files and combine them into a single context
 */
export function loadKnowledgeBase(): string {
  const knowledgeBasePath = path.join(process.cwd(), 'src', 'knowledge-base')

  const files = [
    'about.md',
    'services.md',
    'expertise.md',
    'case-studies.md',
    'resume.md',
  ]

  let combinedContext = `# Decebal Dobrica - Complete Knowledge Base\n\n`
  combinedContext += `This knowledge base contains comprehensive information about Decebal Dobrica, his services, expertise, case studies, and professional background.\n\n`
  combinedContext += `---\n\n`

  for (const file of files) {
    try {
      const filePath = path.join(knowledgeBasePath, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      combinedContext += content + '\n\n---\n\n'
    } catch (error) {
      console.error(`Error loading ${file}:`, error)
    }
  }

  return combinedContext
}
