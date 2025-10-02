import Footer from '@/components/Footer'
import WorkSection from '@/components/WorkSection'
import React from 'react'

const WorkPage = () => {
  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <WorkSection />
      </main>
      <Footer />
    </div>
  )
}

export default WorkPage
