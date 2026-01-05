/**
 * Client-safe specialty metadata
 * This file contains no server-only imports and can be used in client components
 */

export type Specialty = 'rust' | 'ai' | 'smart-contracts' | 'leadership'

// Specialty metadata for landing pages
export const SPECIALTY_META: Record<
  Specialty,
  {
    title: string
    tagline: string
    description: string
    contactCategory: string
  }
> = {
  rust: {
    title: 'Rust Developer & Contractor',
    tagline: 'Building high-performance, production-grade systems',
    description:
      'Expert Rust developer specializing in high-performance APIs, systems programming, and production-grade backend services with Axum, SQLx, and async Rust.',
    contactCategory: 'Rust Development',
  },
  ai: {
    title: 'AI Engineer, Architect & Leader',
    tagline: 'From GenAI strategy to production RAG systems',
    description:
      'AI engineer and architect specializing in GenAI adoption, RAG systems, LLM integration, and AI-assisted development workflows.',
    contactCategory: 'AI Engineering',
  },
  'smart-contracts': {
    title: 'Blockchain Architect & Smart Contract Engineer',
    tagline: 'Scalable Web3 solutions from DeFi to fintech',
    description:
      'Blockchain architect specializing in Solana and Ethereum smart contracts, DeFi protocols, and crypto payment integrations.',
    contactCategory: 'Blockchain Development',
  },
  leadership: {
    title: 'Fractional CTO & Engineering Leader',
    tagline: 'Strategic technical leadership for startups',
    description:
      'Fractional CTO and engineering leader specializing in team topologies, technical strategy, and scaling engineering organizations.',
    contactCategory: 'Engineering Leadership',
  },
}
