
import React, { useEffect, useRef } from 'react';
import { Briefcase, GraduationCap, Award, Heart } from 'lucide-react';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.animate-on-scroll');
            elements.forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('animate-slide-up', 'opacity-100');
              }, 150 * i);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="py-20" ref={sectionRef}>
      <div className="section-container">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">
          Dedicated to crafting exceptional digital experiences through creativity, technical skills, and a commitment to excellence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Professional Experience</h3>
                  <p className="text-white">
                    Over 8 years of experience in design and development, working with clients from startups to enterprise companies.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Education & Training</h3>
                  <p className="text-white">
                    Bachelor's in Computer Science and continuous learning through specialized courses and certifications.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Awards & Recognition</h3>
                  <p className="text-white">
                    Multiple industry awards for outstanding projects and innovative solutions.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start animate-on-scroll opacity-0 transition-all duration-500">
                <div className="bg-brand-teal text-white p-3 rounded-lg shadow-md shadow-brand-teal/20">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Passion Projects</h3>
                  <p className="text-white">
                    Dedicated to continuous improvement and exploring new technologies through personal projects.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative animate-on-scroll opacity-0 transition-all duration-500">
              <div className="absolute -top-5 -left-5 w-24 h-24 bg-brand-teal/20 rounded-lg -z-10 animate-pulse"></div>
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-brand-teal/20 rounded-lg -z-10 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=1000" 
                alt="Professional portrait" 
                className="w-full h-auto rounded-lg shadow-lg object-cover border border-brand-teal/20 transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-teal/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
