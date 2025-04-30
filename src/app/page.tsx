"use client";

import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/layout/PageTransition';
import HeroSection from '@/components/layout/HeroSection';
import { motion, useScroll, useTransform, useMotionValueEvent, cubicBezier } from 'framer-motion';
import ParallaxText from '@/components/ui/ParallaxText';
import { useEffect, useRef, useState, useCallback } from 'react';
import MagneticButton from '@/components/ui/MagneticButton';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import GlassMorphism from '@/components/ui/GlassMorphism';
import TiltCard from '@/components/ui/3DCard';
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
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${sectionColors[currentSection]}`}
            style={{ 
              width: `${scale}%`,
              transform: 'translateZ(0)' // Force GPU acceleration
            }}
            transition={{ type: "tween", ease: "linear" }} // Smoother indicator transition
          />
        </div>
        
        {/* Mobile indicator showing current section */}
        <span className="bg-white dark:bg-gray-900 text-xs px-2 py-1 rounded-md shadow-md md:hidden">
          {sections[currentSection]}
        </span>
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
        
        {/* About Section Teaser - optimized animations */}
        <motion.section 
          id="about"
          className="py-16 bg-white dark:bg-gray-900 overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }} // Increased margin for earlier animation start
          variants={fadeInUp}
        >
          {/* Glassmorphism decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 backdrop-blur-sm -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-500/10 backdrop-blur-sm -ml-48 -mb-48"></div>
          
          <div className="container px-4 mx-auto relative">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white relative inline-block mx-auto optimize-gpu"
              variants={fadeInUp}
            >
              <span className="relative z-10">About Me</span>
              <motion.span 
                className="absolute bottom-0 left-0 h-3 w-full bg-primary/20 -z-10 optimize-gpu"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              ></motion.span>
            </motion.h2>
            <div className="max-w-3xl mx-auto text-center">
              <ScrollRevealText 
                className="text-lg text-gray-700 dark:text-gray-300 mb-8"
                direction="up"
                staggerChildren={0.005} // Reduced stagger time for smoother animation
              >
                I'm a passionate full-stack developer with 5+ years of experience building
                web applications and digital experiences. I specialize in React, Next.js,
                Node.js, and modern web technologies.
              </ScrollRevealText>
              <motion.div 
                variants={popIn}
                className="optimize-gpu"
              >
                <MagneticButton strength={15} rounded="full">
                  <Link 
                    href="/about"
                    className="px-6 py-3 bg-gray-900 text-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors relative overflow-hidden group inline-block"
                  >
                    <span className="relative z-10">Learn More</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/40 to-purple-500/40 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Featured Projects - with optimized animations */}
        <motion.section 
          id="projects"
          className="py-16 bg-gray-50 dark:bg-gray-800 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }} // Increased margin for earlier animation start
          variants={staggerContainer}
        >
          {/* SVG pattern overlay - simplified for better performance */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 40 10 M 10 0 L 10 40" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="container px-4 mx-auto relative">
            {/* Parallax text section */}
            <div className="my-12 -mx-4 py-4 bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10">
              <ParallaxText 
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-6 optimize-gpu"
              >
                Featured Projects
              </ParallaxText>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="max-w-2xl"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Check out some of my recent work. Each project represents unique challenges and solutions.
                </p>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
              >
                <Link 
                  href="/projects"
                  className="text-primary hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300 relative group"
                >
                  <span>View All Projects</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project Cards with 3D tilt effect */}
              {[
                {
                  title: "E-Commerce Platform",
                  description: "A modern e-commerce solution with React, Node.js, and MongoDB.",
                  image: "/images/project1.jpg",
                  tags: [
                    { name: "React", color: "blue" },
                    { name: "Node.js", color: "green" },
                    { name: "MongoDB", color: "purple" }
                  ],
                  link: "/projects/e-commerce-platform"
                },
                {
                  title: "Task Management App",
                  description: "A productivity tool for teams with real-time collaboration features.",
                  image: "/images/project2.jpg",
                  tags: [
                    { name: "Next.js", color: "blue" },
                    { name: "Firebase", color: "yellow" },
                    { name: "Tailwind", color: "red" }
                  ],
                  link: "/projects/task-management-app"
                },
                {
                  title: "Health Monitoring System",
                  description: "A health tracking application with data visualization and insights.",
                  image: "/images/project3.jpg",
                  tags: [
                    { name: "React", color: "blue" },
                    { name: "GraphQL", color: "purple" },
                    { name: "D3.js", color: "green" }
                  ],
                  link: "/projects/health-monitoring-system"
                }
              ].map((project, index) => (
                <motion.div 
                  key={index}
                  variants={popIn}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.5, 
                      delay: index * 0.07 // Slightly reduced delay for smoother staggering
                    }
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                  className="optimize-gpu"
                >
                  <TiltCard
                    tiltMaxAngle={8} // Reduced from 12 for smoother animation
                    tiltScale={1.02} // Reduced from 1.03 for smoother animation
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    glareColor={index === 0 ? '#3B82F6' : index === 1 ? '#8B5CF6' : '#0D9488'}
                    perspective={1000}
                    className="h-full"
                  >
                    <GlassMorphism 
                      intensity="high"
                      color={index === 0 ? "blue" : index === 1 ? "purple" : "teal"}
                      hover={false}
                      border={true}
                      rounded="xl"
                      className="h-full flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden group">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          priority={index < 2} // Prioritize loading first two images
                        />
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 backdrop-blur-sm">
                          <Link 
                            href={project.link}
                            className="text-white font-medium text-sm px-3 py-1.5 bg-primary/80 rounded-full backdrop-blur-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col relative backdrop-blur-sm">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -mt-6 -mr-6"></div>
                        
                        <ScrollRevealText 
                          className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                          direction="left"
                          delay={0.1 + index * 0.05} // Reduced delay for smoother animation
                          staggerChildren={0.01} // Faster stagger for smoother animation
                        >
                          {project.title}
                        </ScrollRevealText>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
                          {project.description}
                        </p>
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {project.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className={`px-3 py-1 bg-${tag.color}-100 text-${tag.color}-800 text-sm rounded-full dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        <Link 
                          href={project.link}
                          className="text-primary hover:text-blue-700 font-medium flex items-center group"
                        >
                          <span>View Case Study</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </GlassMorphism>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Blog Section Teaser */}
        <motion.section 
          id="blog"
          className="py-16 bg-white dark:bg-gray-900 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          variants={staggerContainer}
        >
          {/* Animated background wave pattern - optimized */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <svg 
              viewBox="0 0 1200 300" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute w-full optimize-gpu"
              preserveAspectRatio="none"
              style={{ height: '100%' }}
            >
              <motion.path 
                d="M 0 100 Q 300 150 600 100 Q 900 50 1200 100 L 1200 300 L 0 300 Z"
                fill="currentColor"
                initial={{ d: "M 0 100 Q 300 150 600 100 Q 900 50 1200 100 L 1200 300 L 0 300 Z" }}
                animate={{ 
                  d: [
                    "M 0 100 Q 300 150 600 100 Q 900 50 1200 100 L 1200 300 L 0 300 Z",
                    "M 0 80 Q 300 120 600 130 Q 900 140 1200 80 L 1200 300 L 0 300 Z",
                    "M 0 100 Q 300 150 600 100 Q 900 50 1200 100 L 1200 300 L 0 300 Z"
                  ] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: "linear" // Use linear for smoother infinite animation
                }}
              />
            </svg>
          </div>
          
          <div className="container px-4 mx-auto relative">
            <div className="flex justify-between items-center mb-12">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 dark:text-white"
                variants={fadeInUp}
              >
                Recent Articles
              </motion.h2>
              <motion.div 
                variants={fadeInUp}
              >
                <Link 
                  href="/blog"
                  className="text-primary hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300 relative group"
                >
                  <span>View All Articles</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Blog card with staggered reveal animation */}
              {[1, 2, 3].map((item) => (
                <motion.div 
                  key={item} 
                  variants={popIn}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="optimize-gpu"
                >
                  <GlassMorphism
                    intensity="medium"
                    color={item === 1 ? "pink" : item === 2 ? "blue" : "purple"}
                    hover={true}
                    className="h-full flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden group">
                      <Image
                        src={`/images/blog${item}.jpg`}
                        alt={`Blog ${item}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading={item === 1 ? "eager" : "lazy"} // Only eagerly load first image
                      />
                      {/* Radial gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 
                                      bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_100%)]"></div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Oct {10 + item}, 2023</span>
                        <span className="mx-2">•</span>
                        <span>5 min read</span>
                      </div>
                      <ScrollRevealText 
                        className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                        direction="right"
                        staggerChildren={0.005} // Faster stagger
                      >
                        Blog Post Title {item}
                      </ScrollRevealText>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia.
                      </p>
                      <Link 
                        href={`/blog/post-${item}`}
                        className="text-primary hover:text-blue-700 font-medium inline-flex items-center group"
                      >
                        <span>Read More</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </GlassMorphism>
                </motion.div>
              ))}
            </div>
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