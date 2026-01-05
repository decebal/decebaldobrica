'use client'

import {
  type CrossLink,
  type ExpertiseItem,
  ProfileLandingPage,
} from '@/components/ProfileLandingPage'
import type { RelatedBlogPost, RelatedCaseStudy } from '@/components/RelatedContentSection'
import { SPECIALTY_META } from '@/lib/specialtyMeta'
import { Blocks, Bot, Code, Database, Lightbulb, Terminal, Users } from 'lucide-react'

const expertise: ExpertiseItem[] = [
  {
    title: 'GenAI Strategy & Adoption',
    description:
      'Leading organizations through GenAI adoption, transforming skeptical teams into AI advocates. Achieved 40% sprint acceleration by bridging the gap between engineering and executive vision.',
    icon: <Lightbulb className="w-6 h-6" />,
    skills: ['GenAI Strategy', 'Change Management', 'Team Training', 'ROI Analysis'],
  },
  {
    title: 'RAG Architecture',
    description:
      'Building production RAG systems with vector databases, embeddings, and intelligent retrieval. Expertise in AnythingLLM, LanceDB, and custom RAG pipelines for personalized AI experiences.',
    icon: <Database className="w-6 h-6" />,
    skills: ['RAG', 'Vector Databases', 'Embeddings', 'LanceDB', 'AnythingLLM'],
  },
  {
    title: 'LLM Integration',
    description:
      'Integrating LLMs into production applications with Groq, OpenAI, Anthropic, and local models. Optimizing for latency, cost, and quality with streaming responses and intelligent caching.',
    icon: <Bot className="w-6 h-6" />,
    skills: ['Groq', 'OpenAI', 'Claude', 'Llama', 'Vercel AI SDK'],
  },
  {
    title: 'AI-Assisted Development',
    description:
      'Pioneering AI-assisted development workflows with Claude Code, GitHub Copilot, and custom tooling. Building systems where AI amplifies developer productivity without replacing human judgment.',
    icon: <Code className="w-6 h-6" />,
    skills: ['Claude Code', 'GitHub Copilot', 'AI Pair Programming', 'Code Generation'],
  },
]

const crossLinks: CrossLink[] = [
  {
    title: 'Rust Development',
    tagline: 'High-performance backend systems',
    href: '/rust',
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    title: 'Smart Contracts',
    tagline: 'Blockchain and DeFi solutions',
    href: '/smart-contracts',
    icon: <Blocks className="w-5 h-5" />,
  },
  {
    title: 'Engineering Leadership',
    tagline: 'Strategic technical leadership',
    href: '/about',
    icon: <Users className="w-5 h-5" />,
  },
]

interface AILandingPageProps {
  blogPosts: RelatedBlogPost[]
  caseStudies: RelatedCaseStudy[]
}

export function AILandingPage({ blogPosts, caseStudies }: AILandingPageProps) {
  const meta = SPECIALTY_META.ai

  return (
    <ProfileLandingPage
      specialty={meta.title}
      tagline={meta.tagline}
      heroDescription={
        <>
          <p>
            With <strong>5+ years of AI/ML experience</strong> across fintech, SaaS, and enterprise
            platforms, I help organizations <strong>navigate the GenAI revolution</strong>. From
            strategic adoption to production RAG systems, my approach bridges the gap between
            executive vision and engineering reality, turning AI skeptics into advocates.
          </p>
          <p>
            At CyberSpark Systems, I led a GenAI transformation that achieved{' '}
            <strong>40% sprint acceleration</strong> by reframing AI as a co-pilot rather than a
            replacement. I created daily intelligence dashboards, rolled out targeted AI tools, and
            fundamentally changed how the team approached development.
          </p>
          <p>
            My AI engineering expertise spans the full stack: from building{' '}
            <strong>production RAG systems</strong> with AnythingLLM and Groq, to integrating LLMs
            via the Vercel AI SDK, to pioneering <strong>AI-assisted development workflows</strong>{' '}
            that amplify developer productivity.
          </p>
        </>
      }
      expertise={expertise}
      relatedBlogPosts={blogPosts}
      relatedCaseStudies={caseStudies}
      contactCategory={meta.contactCategory}
      primaryCTAText="Discuss AI Strategy"
      crossLinks={crossLinks}
    />
  )
}
