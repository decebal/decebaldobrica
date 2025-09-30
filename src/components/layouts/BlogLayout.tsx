
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TexturedBackground from '@/components/TexturedBackground';
import { Link } from 'react-router-dom';

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TexturedBackground />
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLayout;
