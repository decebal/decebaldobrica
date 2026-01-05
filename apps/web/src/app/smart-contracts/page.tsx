import { getSpecialtyContent } from '@/lib/contentFilters'
import { config } from '@/lib/personalConfig'
import type { Metadata } from 'next'
import { SmartContractsLandingPage } from './SmartContractsLandingPage'

export const metadata: Metadata = {
  title: `Blockchain Architect & Smart Contract Engineer | ${config.name}`,
  description:
    'Blockchain architect specializing in Solana and Ethereum smart contracts, DeFi protocols, and crypto payment integrations. 60% cost reduction through blockchain infrastructure optimization.',
  keywords: [
    'blockchain architect',
    'smart contract engineer',
    'Solana',
    'Ethereum',
    'DeFi',
    'Web3',
    'crypto payments',
    'Solana Pay',
    'fintech',
    'blockchain development',
  ],
  openGraph: {
    title: `Blockchain Architect & Smart Contract Engineer | ${config.name}`,
    description: 'Blockchain architect specializing in Solana, Ethereum, and DeFi solutions.',
    type: 'website',
    url: `${config.website}/smart-contracts`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blockchain Architect & Smart Contract Engineer | ${config.name}`,
    description: 'Blockchain architect specializing in smart contracts and DeFi.',
  },
}

export default async function SmartContractsPage() {
  const { blogPosts, caseStudies } = await getSpecialtyContent('smart-contracts')
  return <SmartContractsLandingPage blogPosts={blogPosts} caseStudies={caseStudies} />
}
