'use client'

import { NeonGradientCard } from '@/components/ui/neon-gradient-card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { setReferralData } from '@/utils/referralTracking'

interface BlogCTAProps {
  postTitle?: string
}

export function BlogCTA({ postTitle }: BlogCTAProps) {
  const handleGetInTouch = () => {
    setReferralData('Blog Post', postTitle)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-16"
    >
      <NeonGradientCard className="w-full">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <motion.div
            className="shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-brand-teal shadow-lg shadow-brand-teal/50">
              <Image
                src="/images/avatar.jpg"
                alt="Decebal Dobrica"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Let's Connect!</h3>
            <p className="text-gray-300 mb-4">
              Have questions or want to discuss this further? I'd love to hear from you.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/contact?category=Blog+Post" onClick={handleGetInTouch}>
                <Button className="bg-brand-teal hover:bg-brand-teal/80 text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Get in Touch
                </Button>
              </Link>
              <Link
                href="https://github.com/decebal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/decebaldobrica/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10">
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </Button>
              </Link>
              <Link
                href="https://twitter.com/ddonprogramming"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal/10">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </NeonGradientCard>
    </motion.div>
  )
}
