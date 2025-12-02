/**
 * AnythingLLM API Client
 *
 * Provides integration with AnythingLLM for RAG-based content generation.
 * Uses your knowledge base to generate personalized content that matches
 * your writing style and incorporates your experiences and frameworks.
 */

interface AnythingLLMConfig {
  apiUrl: string
  apiKey: string
  workspaceSlug: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  textResponse: string
  sources: Array<{
    title: string
    chunk: string
    score: number
  }>
  type: 'abort' | 'textResponse'
}

interface DocumentUploadResponse {
  success: boolean
  documentId?: string
  error?: string
}

/**
 * Get AnythingLLM configuration from environment variables
 */
function getConfig(): AnythingLLMConfig {
  const apiUrl = process.env.ANYTHINGLLM_API_URL || 'http://localhost:3102'
  const apiKey = process.env.ANYTHINGLLM_API_KEY || ''
  const workspaceSlug = process.env.ANYTHINGLLM_WORKSPACE_SLUG || 'leadership-blog-content'

  if (!apiKey) {
    throw new Error('ANYTHINGLLM_API_KEY is not configured')
  }

  return { apiUrl, apiKey, workspaceSlug }
}

/**
 * Make API request to AnythingLLM
 */
async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config = getConfig()

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`AnythingLLM API error: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

/**
 * Chat with workspace using RAG
 */
export async function chatWithWorkspace(
  message: string,
  mode: 'chat' | 'query' = 'query'
): Promise<ChatResponse> {
  const config = getConfig()

  return makeRequest<ChatResponse>(`/api/v1/workspace/${config.workspaceSlug}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, mode }),
  })
}

/**
 * Generate blog post section using RAG
 */
export async function generateBlogSection({
  topic,
  sectionTitle,
  sectionPrompt,
  keyPoints,
  targetAudience,
  tone,
  context,
}: {
  topic: string
  sectionTitle: string
  sectionPrompt: string
  keyPoints?: string
  targetAudience?: string
  tone?: string
  context?: Array<{ title: string; content: string }>
}): Promise<string> {
  const contextStr = context?.map((c) => `## ${c.title}\n${c.content}`).join('\n\n') || ''

  const prompt = `You are writing a section for a blog post. Use the STAR methodology and reference relevant frameworks, experiences, and examples from the knowledge base.

**Blog Post Topic**: ${topic}

**Section**: ${sectionTitle}

**Instructions**: ${sectionPrompt}

${keyPoints ? `**Key Points to Cover**:\n${keyPoints}\n\n` : ''}

${contextStr ? `**Context from Other Sections**:\n${contextStr}\n\n` : ''}

**Target Audience**: ${targetAudience || 'CTOs and Engineering Leaders'}

**Tone**: ${tone || 'Professional'}

**Important**:
1. Search the knowledge base for relevant frameworks, experiences, and examples
2. Use the author's writing style based on previous blog posts
3. Include specific metrics and concrete examples where possible
4. Reference relevant frameworks by name
5. Write in markdown format
6. Be specific and actionable

Generate ONLY the content for the "${sectionTitle}" section.`

  const response = await chatWithWorkspace(prompt, 'query')
  return response.textResponse
}

/**
 * Research phase: Find relevant content in knowledge base
 */
export async function researchTopic(topic: string): Promise<{
  frameworks: string[]
  experiences: string[]
  examples: string[]
  relatedPosts: string[]
}> {
  const prompt = `Research the following topic in the knowledge base:

**Topic**: ${topic}

Please search for and list:
1. Relevant frameworks and methodologies
2. Personal experiences related to this topic
3. Concrete examples and case studies
4. Similar blog posts I've written

Format your response as a structured list.`

  const response = await chatWithWorkspace(prompt, 'query')

  // Parse the response (this is a simplified parser - you might want to enhance it)
  return {
    frameworks: extractListItems(response.textResponse, 'frameworks'),
    experiences: extractListItems(response.textResponse, 'experiences'),
    examples: extractListItems(response.textResponse, 'examples'),
    relatedPosts: extractListItems(response.textResponse, 'posts'),
  }
}

/**
 * Generate full blog post outline
 */
export async function generateOutline({
  topic,
  keyPoints,
  targetAudience,
  tone,
}: {
  topic: string
  keyPoints?: string
  targetAudience?: string
  tone?: string
}): Promise<string> {
  const prompt = `Create a detailed blog post outline for the following topic, using the STAR + Golden Nuggets methodology.

**Topic**: ${topic}

${keyPoints ? `**Key Points**:\n${keyPoints}\n\n` : ''}

**Target Audience**: ${targetAudience || 'CTOs and Engineering Leaders'}

**Tone**: ${tone || 'Professional'}

**Instructions**:
1. Search the knowledge base for relevant frameworks and experiences
2. Structure the outline using STAR methodology:
   - Hook (Viral Opening)
   - Situation (The Challenge)
   - Task (Define Clear Goals)
   - Action (Strategic Implementation)
   - Result (Measurable Impact)
   - Golden Nuggets (3 business insights)
   - Thinking Tools (3 mental models)
   - Conclusion

3. For each section, include:
   - Main points to cover
   - Relevant frameworks to reference
   - Examples or experiences to include
   - Metrics or data to highlight

Generate a detailed outline that will guide the content generation.`

  const response = await chatWithWorkspace(prompt, 'query')
  return response.textResponse
}

/**
 * Upload document to AnythingLLM
 */
export async function uploadDocument(
  file: File | { name: string; content: string }
): Promise<DocumentUploadResponse> {
  const config = getConfig()

  try {
    const formData = new FormData()

    if (file instanceof File) {
      formData.append('file', file)
    } else {
      // Create a blob from the content
      const blob = new Blob([file.content], { type: 'text/markdown' })
      formData.append('file', blob, file.name)
    }

    const response = await fetch(`${config.apiUrl}/api/v1/document/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()

    // Embed document in workspace
    if (data.success && data.documentId) {
      await embedDocumentInWorkspace(data.documentId)
    }

    return data
  } catch (error) {
    console.error('[AnythingLLM] Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Embed document in workspace
 */
async function embedDocumentInWorkspace(documentId: string): Promise<void> {
  const config = getConfig()

  await makeRequest(`/api/v1/workspace/${config.workspaceSlug}/update-embeddings`, {
    method: 'POST',
    body: JSON.stringify({
      adds: [documentId],
    }),
  })
}

/**
 * List all documents in knowledge base
 */
export async function listDocuments(): Promise<
  Array<{
    id: string
    name: string
    type: string
    createdAt: string
  }>
> {
  const response = await makeRequest<{
    documents: Array<{
      id: string
      name: string
      type: string
      createdAt: string
    }>
  }>('/api/v1/documents')

  return response.documents || []
}

/**
 * Check if AnythingLLM is configured and reachable
 */
export async function checkConnection(): Promise<{
  connected: boolean
  error?: string
}> {
  try {
    const config = getConfig()
    const response = await fetch(`${config.apiUrl}/api/health`)

    return {
      connected: response.ok,
      error: response.ok ? undefined : response.statusText,
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    }
  }
}

/**
 * Helper: Extract list items from text response
 */
function extractListItems(text: string, keyword: string): string[] {
  const lines = text.split('\n')
  const items: string[] = []
  let inSection = false

  for (const line of lines) {
    if (line.toLowerCase().includes(keyword.toLowerCase())) {
      inSection = true
      continue
    }

    if (inSection && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
      const item = line
        .replace(/^[-*]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .trim()
      if (item) items.push(item)
    }

    // Stop if we hit another section
    if (inSection && line.startsWith('##')) {
      break
    }
  }

  return items
}

/**
 * Multi-step content generation workflow
 */
export async function generateBlogPostWithRAG({
  topic,
  keyPoints,
  targetAudience,
  tone,
  onProgress,
}: {
  topic: string
  keyPoints?: string
  targetAudience?: string
  tone?: string
  onProgress?: (step: string, data?: any) => void
}): Promise<{
  research: ReturnType<typeof researchTopic> extends Promise<infer T> ? T : never
  outline: string
  sections: Array<{
    id: string
    title: string
    content: string
    sources: string[]
  }>
}> {
  // Step 1: Research
  onProgress?.('research', { status: 'Starting research...' })
  const research = await researchTopic(topic)
  onProgress?.('research', { status: 'complete', data: research })

  // Step 2: Generate outline
  onProgress?.('outline', { status: 'Creating outline...' })
  const outline = await generateOutline({ topic, keyPoints, targetAudience, tone })
  onProgress?.('outline', { status: 'complete', data: outline })

  // Step 3: Generate sections (using existing structure)
  const BLOG_STRUCTURE = [
    { id: 'hook', title: 'Hook (Viral Opening)', prompt: 'Write a compelling 3-4 line hook' },
    {
      id: 'situation',
      title: 'Situation: The Challenge',
      prompt: 'Describe the context and problem',
    },
    {
      id: 'task',
      title: 'Task: Define Clear Goals',
      prompt: 'Define what needed to be accomplished',
    },
    {
      id: 'actions',
      title: 'Action: Strategic Implementation',
      prompt: 'Describe 3-5 key actions taken',
    },
    { id: 'result', title: 'Result: Measurable Impact', prompt: 'Present concrete results' },
    {
      id: 'golden_nuggets',
      title: 'Business Golden Nuggets (3 required)',
      prompt: 'Extract 3 business golden nuggets',
    },
    {
      id: 'thinking_tools',
      title: 'Thinking Tools Used (3 required)',
      prompt: 'Identify 3 thinking tools/mental models',
    },
    { id: 'conclusion', title: 'Conclusion', prompt: 'Write a strong conclusion' },
  ]

  const sections = []

  for (const section of BLOG_STRUCTURE) {
    onProgress?.('section', { status: `Generating ${section.title}...`, section: section.id })

    const response = await chatWithWorkspace(
      `${section.prompt}

Topic: ${topic}
${keyPoints ? `Key Points: ${keyPoints}` : ''}

Use the outline and research to write this section.`,
      'query'
    )

    sections.push({
      id: section.id,
      title: section.title,
      content: response.textResponse,
      sources: response.sources?.map((s) => s.title) || [],
    })

    onProgress?.('section', { status: 'complete', section: section.id })
  }

  return { research, outline, sections }
}
