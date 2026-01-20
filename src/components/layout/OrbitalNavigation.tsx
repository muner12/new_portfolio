"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/theme/ThemeToggle';
import ScrollProgress from './ScrollProgress';

// Social icons
const socialLinks = [
  { name: 'github', url: 'https://github.com/yourusername', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { name: 'twitter', url: 'https://twitter.com/yourusername', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
  { name: 'linkedin', url: 'https://linkedin.com/in/yourusername', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'email', url: 'mailto:hello@johndoe.com', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' }
];

type NavRoute = {
  name: string;
  href: string;
  icon: string;
  color: string; 
};

const OrbitalNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const pathname = usePathname();
  const [animateOrbit, setAnimateOrbit] = useState(false);
  const [orbitComplete, setOrbitComplete] = useState(false);
  const [menuSize, setMenuSize] = useState({ width: 350, height: 350 });
  const orbitalRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAboutSectionVisible, setIsAboutSectionVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navTransitioned, setNavTransitioned] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  // Navigation items with icons
  const navRoutes: NavRoute[] = [
    { 
      name: 'Home', 
      href: '/', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'from-purple-500 to-indigo-400'
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10',
      color: 'from-green-500 to-teal-400'
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      color: 'from-yellow-500 to-orange-400'
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'from-red-500 to-pink-400'
    },
  ];
  
  // Check if we're on auth or admin pages
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isAdminPage = pathname?.startsWith('/admin');
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pulse animation for improved visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll position and detect when we reach the About section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(scrollPercentage);
      
      // Check if About section is visible
      if (scrollPercentage > 0.8 && !isAboutSectionVisible) {
        setIsAboutSectionVisible(true);
      } else if (scrollPercentage < 0.4 && isAboutSectionVisible) {
        setIsAboutSectionVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAboutSectionVisible]);

  // Trigger navigation transition effect with proper timing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isAboutSectionVisible && !navTransitioned) {
      timer = setTimeout(() => {
        setNavTransitioned(true);
      }, 300);
    } else if (!isAboutSectionVisible && navTransitioned) {
      timer = setTimeout(() => {
        setNavTransitioned(false);
      }, 300);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAboutSectionVisible, navTransitioned]);

  // Responsive sizing for orbital menu
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMenuSize({ width: 320, height: 320 });
      } else if (window.innerWidth < 768) {
        setMenuSize({ width: 400, height: 400 });
      } else if (window.innerWidth < 1024) {
        setMenuSize({ width: 480, height: 480 });
      } else {
        setMenuSize({ width: 550, height: 550 });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active tab based on pathname
  useEffect(() => {
    const route = navRoutes.find(route => pathname === route.href);
    if (route) {
      setActiveTab(route.name.toLowerCase());
    }
  }, [pathname]);

  // Trigger orbit animation when menu is opened
  useEffect(() => {
    if (isOpen) {
      setAnimateOrbit(true);
      const timer = setTimeout(() => {
        setOrbitComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAnimateOrbit(false);
      setOrbitComplete(false);
    }
  }, [isOpen]);

  // If not mounted yet or on auth/admin pages, return null
  if (!isMounted || isAuthPage || isAdminPage) {
    return null;
  }

  // Calculate orbit position based on screen size
  const getOrbitRadius = () => {
    if (typeof window === 'undefined') return 12;
    
    if (window.innerWidth < 640) {
      return 7.5;
    } else if (window.innerWidth < 768) {
      return 9;
    } else if (window.innerWidth < 1024) {
      return 11;
    } else {
      return 13;
    }
  };

  // Determine active route for gradient color
  const activeRoute = navRoutes.find(route => route.name.toLowerCase() === activeTab);
  const activeGradient = activeRoute ? activeRoute.color : 'from-blue-500 to-cyan-400';

  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress color={activeGradient} />
      
      {/* Animated gradient background overlay when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-lg z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Floating toggle button with improved visibility */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 top-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
          isOpen 
            ? 'bg-white text-gray-900' 
            : `bg-gradient-to-r ${activeGradient} text-white`
        } ${!isOpen && isPulsing ? 'ring-4 ring-white/30 ring-offset-2 ring-offset-transparent' : ''}`}
        animate={isPulsing && !isOpen ? 
          { scale: [1, 1.1, 1], boxShadow: ["0px 0px 0px rgba(255,255,255,0.2)", "0px 0px 20px rgba(255,255,255,0.5)", "0px 0px 0px rgba(255,255,255,0.2)"] } 
          : {}
        }
        transition={{ repeat: isPulsing ? Infinity : 0, duration: 2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          className="w-6 h-6 flex flex-col justify-between items-center"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 2.5 },
            }}
            className="w-full h-0.5 bg-current block rounded-full"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            className="w-full h-0.5 bg-current block rounded-full"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -2.5 },
            }}
            className="w-full h-0.5 bg-current block rounded-full"
          />
        </motion.div>
        
        {/* Menu label for better accessibility */}
        {!isOpen && (
          <span className="sr-only">Open menu</span>
        )}
      </motion.button>

      {/* Orbital Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none overflow-y-auto py-20 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Orbital rings */}
            <motion.div 
              ref={orbitalRef}
              className="relative"
              style={{ 
                width: menuSize.width, 
                height: menuSize.height,
                perspective: "1000px" 
              }}
            >
              {/* Main navigation orbit */}
              <motion.div
                className={`absolute inset-0 rounded-full border border-white/20 ${orbitComplete ? 'hidden' : 'block'}`}
                initial={{ scale: 0.5, opacity: 0, rotateX: 60, rotateZ: 0 }}
                animate={animateOrbit ? { 
                  scale: 1, 
                  opacity: 1, 
                  rotateX: 60, 
                  rotateZ: 360 
                } : { scale: 0.5, opacity: 0, rotateX: 60, rotateZ: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {/* Navigation items */}
              {navRoutes.map((route, index) => {
                // Start from top (-90 degrees) and distribute evenly
                const angle = -90 + (index * (360 / navRoutes.length));
                const isActive = route.name.toLowerCase() === activeTab;
                const orbitRadius = getOrbitRadius();
                
                // Calculate position in circle
                const x = Math.cos(angle * (Math.PI / 180)) * orbitRadius;
                const y = Math.sin(angle * (Math.PI / 180)) * orbitRadius;
                
                return (
                  <motion.div
                    key={route.name}
                    className="absolute pointer-events-auto"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    initial={{ 
                      x: '-50%', 
                      y: '-50%', 
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{ 
                      x: `calc(${x}rem - 50%)`,
                      y: `calc(${y}rem - 50%)`,
                      scale: 1,
                      opacity: 1
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      delay: 0.05 * index,
                      duration: 0.5
                    }}
                  >
                    <Link href={route.href}>
                      <motion.div
                        className={`flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                          isActive 
                            ? `bg-gradient-to-r ${route.color} text-white` 
                            : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white'
                        } w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl shadow-lg border border-white/10`}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveTab(route.name.toLowerCase());
                          setIsOpen(false);
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 sm:h-7 sm:w-7" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={route.icon} />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium">{route.name}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Central logo/branding */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link href="/">
                  <motion.div 
                    className={`h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-r ${activeGradient} flex items-center justify-center shadow-lg border-2 border-white/20 cursor-pointer`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab('home');
                      setIsOpen(false);
                    }}
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">BM</span>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="absolute -bottom-32 sm:-bottom-28 inset-x-0 flex justify-center gap-3 pointer-events-auto px-4"
                variants={{
                  hidden: { 
                    opacity: 0,
                    y: 20
                  },
                  visible: { 
                    opacity: 1,
                    y: 0,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ 
                      y: -5,
                      scale: 1.1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.icon} />
                    </svg>
                  </motion.a>
                ))}
              </motion.div>

              {/* Copyright text */}
              <motion.div
                className="absolute -bottom-44 sm:-bottom-40 inset-x-0 text-center text-xs sm:text-sm text-white/50 pointer-events-none px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                © {new Date().getFullYear()} Bakht Munir. All rights reserved.
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Context Indicator (Mini nav) - With scroll transition */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <>
            {/* Top horizontal navigation - visible when not scrolled to About section */}
            {!navTransitioned && (
              <motion.div 
                key="top-nav"
                className="fixed left-0 top-6 right-0 z-30 hidden md:flex justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex flex-row space-x-4 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full"
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.1,
                        duration: 0.5
                      }
                    },
                    exit: { 
                      opacity: 0, 
                      y: -20, 
                      transition: { 
                        staggerChildren: 0.05,
                        staggerDirection: -1,
                        duration: 0.3
                      } 
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {navRoutes.map((route, index) => {
                    const isActive = route.name.toLowerCase() === activeTab;
                    
                    return (
                      <motion.div
                        key={route.name}
                        variants={{
                          hidden: { opacity: 0, y: -20 },
                          visible: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -10 }
                        }}
                      >
                        <Link href={route.href}>
                          <motion.div
                            className={`w-10 h-10 flex items-center justify-center rounded-full group relative cursor-pointer ${
                              isActive 
                                ? `bg-gradient-to-r ${route.color} text-white ring-2 ring-white/20` 
                                : 'bg-white/10 text-white/70 hover:text-white backdrop-blur-sm'
                            }`}
                            whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            onClick={() => setActiveTab(route.name.toLowerCase())}
                            initial={false}
                            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={route.icon} />
                            </svg>
                            
                            {/* Label that appears on hover */}
                            <motion.div
                              className="absolute -bottom-8 whitespace-nowrap bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                              initial={{ y: -5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                            >
                              {route.name}
                            </motion.div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Theme toggle */}
                  <motion.div
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white backdrop-blur-sm group relative"
                    whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -10 }
                    }}
                  >
                    <ThemeToggle />
                    {/* Label that appears on hover */}
                    <motion.div
                      className="absolute -bottom-8 whitespace-nowrap bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      Theme
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Right side vertical navigation - visible when scrolled to About section */}
            {navTransitioned && (
              <motion.div 
                key="right-nav"
                className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden md:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex flex-col space-y-4 bg-gray-900/50 backdrop-blur-sm px-2 py-4 rounded-full"
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    },
                    exit: { 
                      opacity: 0, 
                      x: 50, 
                      transition: { 
                        staggerChildren: 0.05,
                        staggerDirection: -1,
                        duration: 0.3
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {navRoutes.map((route, index) => {
                    const isActive = route.name.toLowerCase() === activeTab;
                    
                    return (
                      <motion.div
                        key={route.name}
                        variants={{
                          hidden: { opacity: 0, x: 100, scale: 0.8 },
                          visible: { opacity: 1, x: 0, scale: 1 },
                          exit: { opacity: 0, x: 20, scale: 0.9 }
                        }}
                        style={{
                          originX: 1,
                          originY: 0.5
                        }}
                      >
                        <Link href={route.href}>
                          <motion.div
                            className={`w-10 h-10 flex items-center justify-center rounded-full group relative cursor-pointer ${
                              isActive 
                                ? `bg-gradient-to-r ${route.color} text-white ring-2 ring-white/20` 
                                : 'bg-white/10 text-white/70 hover:text-white backdrop-blur-sm'
                            }`}
                            whileHover={{ x: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                            onClick={() => setActiveTab(route.name.toLowerCase())}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth={1.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d={route.icon} />
                            </svg>
                            
                            {/* Label that appears on hover */}
                            <motion.div
                              className="absolute right-12 whitespace-nowrap bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                            >
                              {route.name}
                            </motion.div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Theme toggle */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 100, scale: 0.8 },
                      visible: { opacity: 1, x: 0, scale: 1 },
                      exit: { opacity: 0, x: 20, scale: 0.9 }
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white backdrop-blur-sm group relative"
                    whileHover={{ x: -3, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  >
                    <ThemeToggle />
                    {/* Label that appears on hover */}
                    <motion.div
                      className="absolute right-12 whitespace-nowrap bg-gray-900 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      Theme
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrbitalNavigation; 