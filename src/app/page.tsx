"use client";

import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/layout/PageTransition';
import HeroSection from '@/components/layout/HeroSection';
import SkillsSection from '@/components/home/SkillsSection';
import StatsSection from '@/components/home/StatsSection';
import ServicesSection from '@/components/home/ServicesSection';
import ExperienceTimeline from '@/components/home/ExperienceTimeline';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { motion, useScroll, useTransform, useMotionValueEvent, cubicBezier } from 'framer-motion';
import ParallaxText from '@/components/ui/ParallaxText';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import { useEffect, useRef, useState, useCallback } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import FloatingElement from '@/components/ui/FloatingElement';

export default function Home() {
  // Ref for the scroll container
  const containerRef = useRef(null);
  
  // State for current section (for scroll indicator)
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ["hero", "about", "projects", "blog", "contact"];
  
  // Scroll progress for animations with smoother transform
  const { scrollYProgress } = useScroll();
  // Use valid easing with cubicBezier
  const customEase = cubicBezier(0.32, 0.72, 0, 1);
  const smoothScrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    ease: customEase
  });
  const scale = useTransform(smoothScrollProgress, [0, 1], [0, 100]);
  
  // Throttled section detection to improve performance
  const updateSection = useCallback((latest: number) => {
    const sectionIndex = Math.min(
      Math.floor(latest * sections.length),
      sections.length - 1
    );
    setCurrentSection(sectionIndex);
  }, [sections.length]);

  // Track scroll position with throttling
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update visuals on animation frames for better performance
    requestAnimationFrame(() => {
      updateSection(latest);
    });
  });
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };
  
  const shimmer = {
    hidden: { backgroundPosition: "200% 0" },
    visible: { 
      backgroundPosition: "0% 0",
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  // Colors for scroll indicator based on section
  const sectionColors = [
    "bg-gradient-to-r from-blue-500 to-indigo-600",
    "bg-gradient-to-r from-indigo-500 to-purple-600",
    "bg-gradient-to-r from-purple-500 to-pink-600",
    "bg-gradient-to-r from-pink-500 to-red-600",
    "bg-gradient-to-r from-blue-400 to-blue-600"
  ];

  // Optimize CSS for smoother performance
  useEffect(() => {
    // Add will-change to optimize elements that will animate during scroll
    const elementsToOptimize = document.querySelectorAll('.optimize-gpu');
    elementsToOptimize.forEach(el => {
      (el as HTMLElement).style.willChange = 'transform, opacity';
      (el as HTMLElement).style.transform = 'translateZ(0)'; // Force GPU acceleration
    });

    return () => {
      // Clean up will-change properties
      elementsToOptimize.forEach(el => {
        (el as HTMLElement).style.willChange = 'auto';
      });
    };
  }, []);

  return (
    <PageTransition>
      {/* Fixed scroll progress indicator - optimized for GPU */}
      <motion.div 
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 optimize-gpu"
        style={{ 
          transform: 'translate3d(-50%, 0, 0)', // Force GPU acceleration
          backfaceVisibility: 'hidden'
        }}
      >
       
      </motion.div>
      
      <div className="relative" ref={containerRef}>
        <div id="hero">
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <FloatingElement
              xRange={[-30, 30]}
              yRange={[0, 40]}
              duration={15}
              className="absolute top-[15%] right-[10%] optimize-gpu"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-500/20 backdrop-blur-sm rounded-full" />
            </FloatingElement>
            <FloatingElement
              xRange={[-25, 25]}
              yRange={[-40, 0]}
              duration={18}
              delay={0.5}
              className="absolute bottom-[20%] left-[15%] optimize-gpu"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 bg-purple-500/10 backdrop-blur-sm rounded-full" />
            </FloatingElement>
            <FloatingElement
              xRange={[-15, 15]}
              yRange={[-15, 15]}
              scaleRange={[0.9, 1.1]}
              rotateRange={[-10, 10]}
              duration={12}
              className="absolute top-[40%] left-[50%] transform -translate-x-1/2 optimize-gpu"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg rotate-45" />
            </FloatingElement>
          </div>
          <HeroSection />
        </div>
        
        {/* Reduced background elements for better performance */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
          {[...Array(3)].map((_, i) => ( // Reduced from 5 to 3 for better performance
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl optimize-gpu"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, Math.random() * 0.5 + 0.8, 1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear" // Linear easing for smoother animations
              }}
            />
          ))}
        </div>
        
        {/* Stats Section */}
        <StatsSection />

        {/* Skills Section */}
        <SkillsSection />

        {/* Services Section */}
        <ServicesSection />


        {/* Featured Projects */}
        <FeaturedProjects />

        {/* Experience Timeline */}
        <ExperienceTimeline />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Blog Section Teaser */}
        <motion.section 
          id="blog"
          className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container px-4 mx-auto relative z-10 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 mb-6"
              >
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                variants={fadeInUp}
              >
                Recent Articles
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Insights, tutorials, and thoughts on web development and technology
              </motion.p>
            </div>
            
            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  title: "Building Scalable Web Applications with Next.js",
                  category: "Development",
                  date: "Oct 15, 2023",
                  readTime: 8,
                  excerpt: "Learn how to build performant and scalable web applications using Next.js 14 with app router and server components."
                },
                { 
                  title: "Modern React Patterns and Best Practices",
                  category: "React",
                  date: "Oct 12, 2023",
                  readTime: 6,
                  excerpt: "Explore advanced React patterns including custom hooks, context optimization, and state management strategies."
                },
                { 
                  title: "Mastering TypeScript for Better Code Quality",
                  category: "TypeScript",
                  date: "Oct 08, 2023",
                  readTime: 10,
                  excerpt: "Deep dive into TypeScript features and how to leverage them for writing more maintainable and type-safe code."
                }
              ].map((article, index) => (
                <motion.article 
                  key={index} 
                  variants={popIn}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10">
                    <Image
                      src={`/images/blog${index + 1}.jpg`}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-700">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{article.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{article.readTime} min read</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      <Link href={`/blog/post-${index + 1}`}>
                        {article.title}
                      </Link>
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/blog/post-${index + 1}`}
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group/link"
                    >
                      <span>Read Article</span>
                      <svg 
                        className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* View All Button */}
            <motion.div 
              className="text-center"
              variants={fadeInUp}
            >
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>View All Articles</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact CTA with creative elements - optimized */}
        <motion.section 
          id="contact"
          className="py-20 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={fadeInUp}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          {/* Animated shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FloatingElement
              xRange={[0, 40]}
              yRange={[0, 40]}
              scaleRange={[1, 1.2]}
              duration={10}
              className="absolute top-0 left-[10%] optimize-gpu"
            >
              <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-xl" />
            </FloatingElement>
            <FloatingElement
              xRange={[0, -30]}
              yRange={[-50, 0]}
              scaleRange={[1, 1.3]}
              duration={15}
              delay={0.5}
              className="absolute bottom-0 right-[10%] optimize-gpu"
            >
              <div className="w-80 h-80 rounded-full bg-blue-500/10 backdrop-blur-xl" />
            </FloatingElement>
          </div>
          
          {/* Floating particles - reduced number for better performance */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/60 optimize-gpu"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translateZ(0)' // Force GPU acceleration
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear" // Linear for smoother animation
              }}
            />
          ))}
          
          <div className="container px-4 mx-auto text-center relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-white optimize-gpu"
              variants={fadeInUp}
              custom={1}
            >
              Ready to Work Together?
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
              custom={2}
            >
              I'm currently available for freelance projects, full-time positions, or consulting work.
            </motion.p>
            <motion.div
              variants={popIn}
              custom={3}
              className="optimize-gpu"
            >
              <MagneticButton strength={12} rounded="full">
                <Link 
                  href="/contact"
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium shadow-lg hover:bg-blue-50 transition-colors inline-block relative overflow-hidden group"
                >
                  <span className="relative z-10">Get in Touch</span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white/50 -z-10"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Credits - small link at the bottom */}
        <motion.div 
          className="text-center py-6 text-xs text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} Bakht Munir. All rights reserved.
        </motion.div>
      </div>
    </PageTransition>
  );
} 