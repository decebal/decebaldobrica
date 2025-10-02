'use client'

import type { Project } from '@/types/project'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const projects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    category: 'web',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400',
    description: 'A modern e-commerce platform with a seamless shopping experience.',
    link: '#',
    slug: 'ecommerce-platform',
    longDescription:
      'A comprehensive e-commerce solution built with React and Node.js. Features include user authentication, product listings, cart functionality, and secure checkout.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: ['Responsive design', 'User authentication', 'Product search', 'Secure checkout'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
  },
  {
    id: 2,
    title: 'Healthcare Dashboard',
    category: 'design',
    image:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
    description: 'Interactive dashboard for healthcare providers to monitor patient data.',
    link: '#',
    slug: 'healthcare-dashboard',
    longDescription:
      'A dashboard designed for healthcare professionals to visualize and monitor patient data in real-time. Includes interactive charts and a comprehensive reporting system.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: [
      'Real-time data visualization',
      'Patient tracking',
      'Appointment scheduling',
      'Reporting tools',
    ],
    technologies: ['React', 'D3.js', 'Express', 'PostgreSQL'],
  },
  {
    id: 3,
    title: 'Mobile Banking App',
    category: 'mobile',
    image:
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400',
    description: 'Secure and intuitive mobile banking application with advanced features.',
    link: '#',
    slug: 'mobile-banking-app',
    longDescription:
      'A mobile banking application that provides users with secure access to their financial information. Features include transaction history, bill payments, and fund transfers.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: [
      'Biometric authentication',
      'Transaction history',
      'Bill payments',
      'Fund transfers',
    ],
    technologies: ['React Native', 'Firebase', 'Redux', 'Java'],
  },
  {
    id: 4,
    title: 'AI Content Generator',
    category: 'ai',
    image:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400',
    description: 'Smart content generator powered by advanced AI algorithms.',
    link: '#',
    slug: 'ai-content-generator',
    longDescription:
      'An AI-powered content generation tool that helps users create high-quality content for various purposes. Utilizes natural language processing to generate human-like text.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: [
      'Text generation',
      'Content optimization',
      'SEO suggestions',
      'Multiple formats support',
    ],
    technologies: ['Python', 'TensorFlow', 'GPT-3', 'React'],
  },
  {
    id: 5,
    title: 'Educational Platform',
    category: 'web',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=400',
    description: 'Comprehensive learning platform for students and educators.',
    link: '#',
    slug: 'educational-platform',
    longDescription:
      'An online learning platform that connects students with educators. Features include course management, interactive lessons, and progress tracking.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: [
      'Course creation',
      'Interactive quizzes',
      'Progress tracking',
      'Certificate generation',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'WebSockets'],
  },
  {
    id: 6,
    title: 'Smart Home System',
    category: 'iot',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400',
    description: 'Connected home solution with intuitive controls and automation.',
    link: '#',
    slug: 'smart-home-system',
    longDescription:
      'A smart home system that allows users to control and monitor their home devices remotely. Includes automation capabilities and energy usage monitoring.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    features: ['Device control', 'Automation scheduling', 'Energy monitoring', 'Voice commands'],
    technologies: ['IoT', 'MQTT', 'React', 'Node.js'],
  },
]

const categories = ['all', 'web', 'design', 'mobile', 'ai', 'iot']

const WorkSection = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <section id="work" className="py-20">
      <div className="section-container">
        <h2 className="section-title">My Work</h2>
        <p className="section-subtitle">
          Explore a collection of my recent projects across different domains and technologies.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full capitalize ${
                category === activeCategory
                  ? 'bg-brand-teal text-white'
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white'
              } transition-colors duration-200`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="brand-card bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-md card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-brand-teal/90 text-white rounded-full px-3 py-1 text-xs font-medium capitalize">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center text-brand-teal font-medium hover:text-brand-teal/80"
                  >
                    View Details
                  </Link>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-white"
                  >
                    Demo <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkSection

// Export the projects array for use in other components
export { projects }
