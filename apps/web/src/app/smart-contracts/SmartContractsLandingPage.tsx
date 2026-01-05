'use client'

import {
  type CrossLink,
  type ExpertiseItem,
  ProfileLandingPage,
} from '@/components/ProfileLandingPage'
import type { RelatedBlogPost, RelatedCaseStudy } from '@/components/RelatedContentSection'
import { SPECIALTY_META } from '@/lib/specialtyMeta'
import { Blocks, Brain, CreditCard, Network, Terminal, Users, Wallet } from 'lucide-react'

const expertise: ExpertiseItem[] = [
  {
    title: 'Smart Contract Development',
    description:
      'Building secure, gas-efficient smart contracts on Solana and Ethereum. From token programs to complex DeFi protocols, with a focus on security audits and best practices.',
    icon: <Blocks className="w-6 h-6" />,
    skills: ['Solana', 'Ethereum', 'Anchor', 'Solidity', 'Rust'],
  },
  {
    title: 'Blockchain Infrastructure',
    description:
      'Optimizing blockchain infrastructure for scalability and cost-efficiency. Achieved 60% cost reduction through indexer optimization and RPC management at Mundo Wallet.',
    icon: <Network className="w-6 h-6" />,
    skills: ['Indexers', 'RPC Nodes', 'Helius', 'Alchemy', 'Infrastructure'],
  },
  {
    title: 'Crypto Payments',
    description:
      'Integrating crypto payment solutions for real-world applications. Built Solana Pay integrations and multi-chain payment flows for seamless user experiences.',
    icon: <CreditCard className="w-6 h-6" />,
    skills: ['Solana Pay', 'Payment APIs', 'Wallet Integration', 'Multi-chain'],
  },
  {
    title: 'Web3 Architecture',
    description:
      'Designing scalable Web3 architectures that bridge traditional finance and crypto. From DeFi protocols to fintech apps for high-inflation markets.',
    icon: <Wallet className="w-6 h-6" />,
    skills: ['DeFi', 'Tokenomics', 'Fintech', 'Virtual Cards', 'Stablecoins'],
  },
]

const crossLinks: CrossLink[] = [
  {
    title: 'AI Engineering',
    tagline: 'GenAI integration and RAG systems',
    href: '/ai',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    title: 'Rust Development',
    tagline: 'High-performance backend systems',
    href: '/rust',
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    title: 'Engineering Leadership',
    tagline: 'Strategic technical leadership',
    href: '/about',
    icon: <Users className="w-5 h-5" />,
  },
]

interface SmartContractsLandingPageProps {
  blogPosts: RelatedBlogPost[]
  caseStudies: RelatedCaseStudy[]
}

export function SmartContractsLandingPage({
  blogPosts,
  caseStudies,
}: SmartContractsLandingPageProps) {
  const meta = SPECIALTY_META['smart-contracts']

  return (
    <ProfileLandingPage
      specialty={meta.title}
      tagline={meta.tagline}
      heroDescription={
        <>
          <p>
            With <strong>7+ years in blockchain</strong> spanning Ethereum mining, smart contract
            development, and DeFi architecture, I build <strong>blockchain solutions</strong> that
            bridge the gap between crypto innovation and real-world utility. From smart contracts to
            fintech apps, I create systems that work for users in challenging markets.
          </p>
          <p>
            At <strong>Mundo Wallet</strong>, I transformed a crypto wallet into a fintech
            application for high-inflation, restricted-currency markets. This included virtual card
            integration, blockchain infrastructure optimization that{' '}
            <strong>cut costs by 60%</strong>, and smart contract improvements for scalability.
          </p>
          <p>
            My blockchain expertise spans <strong>Solana and Ethereum ecosystems</strong>, including
            payment integrations with Solana Pay, DeFi protocol design, and infrastructure
            optimization. I focus on building secure, cost-efficient solutions that deliver real
            business value.
          </p>
        </>
      }
      expertise={expertise}
      relatedBlogPosts={blogPosts}
      relatedCaseStudies={caseStudies}
      contactCategory={meta.contactCategory}
      primaryCTAText="Discuss Blockchain Project"
      crossLinks={crossLinks}
    />
  )
}
