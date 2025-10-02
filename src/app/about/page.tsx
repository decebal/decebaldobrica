'use client'

import Footer from '@/components/Footer'
import { GlowButton } from '@/components/ui/glow-button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import React, { useEffect } from 'react'

const AboutPage = () => {
  // Initialize animations on component mount
  useEffect(() => {
    // Add animation classes to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item')
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-slide-up', 'opacity-100')
      }, 100 * index)
    })
  }, [])

  return (
    <div className="min-h-screen relative">
      <main className="pt-24 pb-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Information Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="text-center lg:text-left">
                  <div className="relative mx-auto lg:mx-0 w-48 h-48 rounded-full overflow-hidden border-4 border-brand-teal mb-6 shadow-lg shadow-brand-teal/20 animate-fade-in">
                    <img
                      src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=1000"
                      alt="Decebal Dobrica"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-brand-heading animate-fade-in">
                    Decebal Dobrica
                  </h1>
                  <p className="text-lg text-brand-paragraph mt-2 animate-fade-in">
                    Full-Stack Developer & AI Specialist
                  </p>
                </div>

                <div className="flex justify-center lg:justify-start space-x-4 animate-fade-in">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="mailto:decebal@dobrica.dev"
                    className="text-brand-heading hover:text-brand-teal transition-colors transform hover:scale-110 duration-200"
                  >
                    <Mail size={24} />
                  </a>
                </div>

                <div className="flex flex-col space-y-4">
                  <ShimmerButton
                    className="w-full group flex items-center justify-center gap-2 text-white"
                    onClick={() => window.open('/cv.pdf', '_blank')}
                  >
                    <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Download CV</span>
                  </ShimmerButton>

                  <GlowButton
                    className="w-full group flex items-center justify-center gap-2"
                    onClick={() => (window.location.href = 'mailto:decebal@dobrica.dev')}
                  >
                    <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Contact Me</span>
                  </GlowButton>
                </div>
              </div>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-12">
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  About Me
                </h2>
                <div className="prose prose-lg max-w-none text-white">
                  <p>
                    I am a Full-Stack Developer with a passion for developing innovative solutions to
                    complex problems. With expertise in artificial intelligence, modern web
                    technologies, and blockchain, I specialize in creating intelligent systems that
                    drive business value.
                  </p>
                  <p>
                    My journey in technology began with a strong foundation in software engineering,
                    which evolved into a focused career in AI and full-stack development. I've worked
                    across diverse domains including healthcare, finance, and industrial applications,
                    implementing solutions that transform raw data into actionable insights.
                  </p>
                  <p>
                    Beyond technical skills, I bring strategic thinking and business acumen to
                    projects, ensuring that solutions address real-world challenges. I'm particularly
                    interested in the ethical implications of AI and strive to develop responsible
                    applications that benefit society.
                  </p>
                </div>
              </section>

              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Full-Stack Development
                    </h3>
                    <p className="text-white">
                      Deep expertise in React, Next.js, Node.js, and modern web technologies for
                      building scalable applications.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      AI & Machine Learning
                    </h3>
                    <p className="text-white">
                      Specialized in integrating AI capabilities, building chatbots, and implementing
                      intelligent features.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">
                      Blockchain & Crypto
                    </h3>
                    <p className="text-white">
                      Proficient in Solana, Ethereum, and cryptocurrency payment integrations for
                      decentralized applications.
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 transform transition-all duration-300 hover:border-brand-teal/60 hover:shadow-md hover:shadow-brand-teal/10 hover:-translate-y-1">
                    <h3 className="text-xl font-semibold mb-3 text-brand-heading">Cloud & DevOps</h3>
                    <p className="text-white">
                      Experience in building robust deployment pipelines, CI/CD, and cloud
                      infrastructure management.
                    </p>
                  </div>
                </div>
              </section>

              {/* Experience Section with Updated Timeline */}
              <section>
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2">
                  Experience
                </h2>
                <div className="space-y-6">
                  {/* Timeline items */}
                  <div className="relative pl-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-gradient-to-b before:from-brand-teal before:to-brand-teal/20">
                    {/* Timeline items */}
                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">
                          Lead Full-Stack Developer
                        </h3>
                        <p className="text-brand-teal mb-2">TechInnovate Solutions • 2020 - Present</p>
                        <p className="text-white">
                          Leading a team of developers in creating cutting-edge web applications with
                          AI integration. Responsible for architecture design, implementation, and
                          stakeholder communication.
                        </p>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Senior Developer</h3>
                        <p className="text-brand-teal mb-2">DataDriven Analytics • 2017 - 2020</p>
                        <p className="text-white">
                          Developed and deployed full-stack applications with focus on performance and
                          scalability. Collaborated with cross-functional teams to implement data-driven
                          solutions.
                        </p>
                      </div>
                    </div>

                    <div className="relative mb-12">
                      <div className="absolute -left-[7px] top-2 h-4 w-4 rounded-full bg-brand-teal glow-sm"></div>
                      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-brand-teal/20 hover:border-brand-teal/40 transition-colors">
                        <h3 className="text-xl font-semibold text-white">Software Engineer</h3>
                        <p className="text-brand-teal mb-2">CodeCraft Technologies • 2015 - 2017</p>
                        <p className="text-white">
                          Developed backend systems and APIs for web applications. Implemented data
                          processing pipelines and contributed to the company's transition to cloud
                          infrastructure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 text-brand-heading border-b-2 border-brand-teal inline-block pb-2 animate-fade-in">
                  Education
                </h2>
                <div className="relative before:absolute before:inset-y-0 before:left-[17px] before:w-0.5 before:bg-brand-teal/70 ml-[18px]">
                  <div className="timeline-item relative pl-8 pb-10 opacity-0 transition-all duration-500">
                    <div className="absolute w-8 h-8 bg-gradient-to-b from-brand-teal to-brand-teal/80 rounded-full -left-[17px] top-0 z-10 shadow-md shadow-brand-teal/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      MSc in Computer Science, AI Specialization
                    </h3>
                    <p className="text-brand-teal mb-2">Technical University • 2013 - 2015</p>
                    <p className="text-white">
                      Focused on machine learning algorithms, computer vision, and natural language
                      processing. Thesis on reinforcement learning applications in autonomous systems.
                    </p>
                  </div>

                  <div className="timeline-item relative pl-8 opacity-0 transition-all duration-500">
                    <div className="absolute w-8 h-8 bg-gradient-to-b from-brand-teal to-brand-teal/80 rounded-full -left-[17px] top-0 z-10 shadow-md shadow-brand-teal/20 flex items-center justify-center">
                      <div className="w-4 h-4 bg-brand-darknavy rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">BSc in Computer Science</h3>
                    <p className="text-brand-teal mb-2">University • 2009 - 2013</p>
                    <p className="text-white">
                      Studied fundamentals of computer science, mathematics, and software engineering.
                      Graduated with honors.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
