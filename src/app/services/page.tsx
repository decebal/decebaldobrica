import Footer from '@/components/Footer'
import EthereumIcon from '@/components/icons/EthereumIcon'
import SolanaIcon from '@/components/icons/SolanaIcon'
import ServicesSection from '@/components/ServicesSection'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Bitcoin, Briefcase, Calendar } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ServicesPage = () => {
  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="section-container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white animate-fade-in">
              Fractional CTO Services
            </h1>
            <p
              className="text-xl text-gray-300 mb-8 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              Expert technical leadership and consultations to help your business thrive in the
              digital landscape.
            </p>
            <div
              className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link href="/services/book">
                <ShimmerButton className="px-8 py-3">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Book Consultation
                </ShimmerButton>
              </Link>
              <Link href="/contact">
                <ShimmerButton className="px-8 py-3 bg-transparent border border-brand-teal/30">
                  <Calendar className="mr-2 h-5 w-5" />
                  Contact Me
                </ShimmerButton>
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-gray-400 mb-4">Multiple payment options available:</p>
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <Bitcoin className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Bitcoin</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <EthereumIcon className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Ethereum</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/5 p-3 rounded-full mb-2">
                    <SolanaIcon className="h-6 w-6 text-brand-teal" />
                  </div>
                  <span className="text-sm text-white">Solana Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <ServicesSection />
      </main>

      <Footer />
    </div>
  )
}

export default ServicesPage
