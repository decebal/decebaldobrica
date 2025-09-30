
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-brand-darknavy/80 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
    )}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-brand-teal">Decebal<span className="text-brand-heading">Dobrica</span></Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="brand-nav-link">Home</Link>
          <Link to="/about" className="brand-nav-link">About Me</Link>
          <Link to="/work" className="brand-nav-link">My Work</Link>
          <Link to="/services" className="brand-nav-link">Services</Link>
          <Link to="/testimonials" className="brand-nav-link">Testimonials</Link>
          <Link to="/blog" className="brand-nav-link">Blog</Link>
          <Link to="/contact" className="brand-btn-primary flex items-center">
            <span>Talk With Me</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-brand-heading"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-darknavy/95 backdrop-blur-md shadow-lg absolute top-full left-0 right-0 p-4 border-t border-brand-teal/20">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">Home</Link>
            <Link to="/about" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">About Me</Link>
            <Link to="/work" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">My Work</Link>
            <Link to="/services" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">Services</Link>
            <Link to="/testimonials" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">Testimonials</Link>
            <Link to="/blog" onClick={closeMobileMenu} className="text-brand-heading hover:text-brand-teal text-left p-2 hover:bg-white/5 rounded transition-colors">Blog</Link>
            <Link to="/contact" onClick={closeMobileMenu} className="w-full">
              <Button className="w-full bg-brand-teal hover:bg-brand-teal/90">
                Talk With Me
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
