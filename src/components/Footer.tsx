import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-brand-darknavy/80 text-white pt-16 pb-8 border-t border-brand-teal/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Decebal Dobrica</h3>
            <p className="text-gray-300 mb-4">
              Creating exceptional digital experiences through creativity and technical excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-teal transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-brand-teal transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#work" className="text-gray-400 hover:text-brand-teal transition-colors">
                  My Work
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-brand-teal shrink-0" />
                <span className="text-gray-400">123 Creative Street, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-brand-teal" />
                <a
                  href="tel:+11234567890"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-brand-teal" />
                <a
                  href="mailto:decebal@dobrica.dev"
                  className="text-gray-400 hover:text-brand-teal transition-colors"
                >
                  decebal@dobrica.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Decebal Dobrica. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
