import { getSpecialtyContent } from '@/lib/contentFilters'
import { config } from '@/lib/personalConfig'
import type { Metadata } from 'next'
import { AILandingPage } from './AILandingPage'

export const metadata: Metadata = {
  title: `AI Engineer, Architect & Leader | ${config.name}`,
  description:
    'AI engineer and architect specializing in GenAI adoption, RAG systems, LLM integration, and AI-assisted development. 40% sprint acceleration through strategic AI implementation.',
  keywords: [
    'AI engineer',
    'GenAI',
    'RAG systems',
    'LLM integration',
    'machine learning',
    'AI architect',
    'Groq',
    'OpenAI',
    'Claude',
    'AI-assisted development',
  ],
  openGraph: {
    title: `AI Engineer, Architect & Leader | ${config.name}`,
    description: 'AI engineer specializing in GenAI adoption, RAG systems, and LLM integration.',
    type: 'website',
    url: `${config.website}/ai`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `AI Engineer, Architect & Leader | ${config.name}`,
    description: 'AI engineer specializing in GenAI adoption and RAG systems.',
  },
}

export default async function AIPage() {
  const { blogPosts, caseStudies } = await getSpecialtyContent('ai')
  return <AILandingPage blogPosts={blogPosts} caseStudies={caseStudies} />
}
