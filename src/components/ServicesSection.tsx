import React from 'react';
import { 
  Code, 
  PenTool, 
  MonitorSmartphone, 
  Compass, 
  Database, 
  Lightbulb, 
  Briefcase, 
  Clock, 
  Users, 
  BarChart 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Briefcase className="h-8 w-8" />,
    title: 'Fractional CTO Services',
    description: 'Expert technical leadership without the full-time commitment. Strategic guidance for your tech decisions.',
    featured: true
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Technical Consultation',
    description: 'Book a dedicated consultation session to solve your most pressing technical challenges.',
    featured: true
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Team Building & Management',
    description: 'Strategies for building and managing high-performing technical teams.',
    featured: false
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: 'Technology Strategy',
    description: 'Long-term technology roadmapping and strategic planning for sustainable growth.',
    featured: false
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: 'System Architecture',
    description: 'Designing scalable and efficient systems that support your business needs.',
    featured: false
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: 'Code Reviews & Audits',
    description: 'Thorough evaluation of your codebase to identify improvements and potential issues.',
    featured: false
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="section-title">My Services</h2>
        <p className="section-subtitle">
          Comprehensive solutions tailored to meet your specific needs and goals.
        </p>
        
        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.filter(service => service.featured).map((service, index) => (
            <div 
              key={index} 
              className="brand-card p-8 rounded-lg hover-glow transition-all duration-300"
            >
              <div className="bg-brand-teal/20 rounded-lg p-4 inline-block mb-6 text-brand-teal">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <Link to="/services/book">
                <ShimmerButton className="w-full">
                  Book a Session
                </ShimmerButton>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Other Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.filter(service => !service.featured).map((service, index) => (
            <div 
              key={index} 
              className="brand-card p-6 rounded-lg hover-lift transition-all duration-300"
            >
              <div className="bg-brand-teal/10 rounded-lg p-3 inline-block mb-4 text-brand-teal">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{service.title}</h3>
              <p className="text-gray-300 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to elevate your tech strategy?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Book a consultation today and discover how my expertise can transform your technical challenges into opportunities.
          </p>
          <Link to="/services/book">
            <Button size="lg" className="bg-brand-teal hover:bg-brand-teal/90 text-white">
              Schedule Your Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
