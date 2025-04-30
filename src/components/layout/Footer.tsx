"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define type for social network names
type SocialNetwork = 'twitter' | 'github' | 'linkedin' | 'email';

const Footer = () => {
  const [hoverState, setHoverState] = useState({
    twitter: false,
    github: false,
    linkedin: false,
    email: false
  });

  const year = new Date().getFullYear();

  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const socialLinks = [
    { name: 'twitter' as SocialNetwork, url: 'https://twitter.com/yourusername', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
    { name: 'github' as SocialNetwork, url: 'https://github.com/yourusername', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
    { name: 'linkedin' as SocialNetwork, url: 'https://linkedin.com/in/yourusername', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  ];

  // Links for footer navs
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const resourceLinks = [
    { name: 'Resume', href: '/resume' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Open Source', href: '/open-source' },
  ];

  // Meteor animation for the footer
  const meteors = new Array(5).fill(null);

  return (
    <motion.footer 
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full relative mt-20"
    >
      {/* Particle animation effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {meteors.map((_, idx) => (
          <span
            key={idx}
            className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white rounded-full shadow-xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255, 1)',
              animation: `meteor 5s linear infinite`,
              animationDelay: `${idx * 0.9}s`
            }}
          />
        ))}
      </div>

      {/* Main footer content with glassmorphism effect */}
      <div className="relative z-10 backdrop-blur-sm bg-gray-900/90 border-t border-white/10">
        <div className="mx-auto w-full max-w-screen-xl p-6 lg:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {/* Brand section */}
            <div className="col-span-1 md:col-span-3 lg:col-span-2">
              <Link 
                href="/" 
                className="inline-block mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 mr-3 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <span className="text-xl font-bold text-white">John Doe</span>
                </motion.div>
              </Link>
              
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
                I'm a creative developer focused on building beautiful, functional, and user-centered digital experiences. Let's create something amazing together.
              </p>
              
              {/* Social links */}
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-colors"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoverState(prev => ({ ...prev, [social.name]: true }))}
                    onHoverEnd={() => setHoverState(prev => ({ ...prev, [social.name]: false }))}
                  >
                    <motion.svg 
                      className={`w-[18px] h-[18px] fill-current ${hoverState[social.name] ? 'text-white' : 'text-gray-400'}`} 
                      viewBox="0 0 24 24"
                      animate={hoverState[social.name] ? { rotate: [0, -10, 10, -5, 0], scale: 1.1 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <path d={social.icon} />
                    </motion.svg>
                  </motion.a>
                ))}
                
                <motion.a
                  href="mailto:hello@johndoe.com"
                  className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/25 transition-colors"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoverState(prev => ({ ...prev, email: true }))}
                  onHoverEnd={() => setHoverState(prev => ({ ...prev, email: false }))}
                >
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-[18px] h-[18px] fill-none stroke-current ${hoverState.email ? 'text-white' : 'text-gray-400'}`}
                    viewBox="0 0 24 24" 
                    strokeWidth="2"
                    animate={hoverState.email ? { rotate: [0, -10, 10, -5, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </motion.svg>
                </motion.a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-semibold text-sm text-white mb-4">Navigation</p>
              <ul className="mt-4 space-y-3">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} legacyBehavior>
                      <motion.a 
                        className="text-gray-400 transition-colors duration-300 hover:text-primary text-sm group flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="mr-2">{link.name}</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="font-semibold text-sm text-white mb-4">Resources</p>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} legacyBehavior>
                      <motion.a 
                        className="text-gray-400 transition-colors duration-300 hover:text-primary text-sm group flex items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="mr-2">{link.name}</span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get in touch */}
            <div>
              <p className="font-semibold text-sm text-white mb-4">Contact</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a 
                    href="mailto:hello@johndoe.com" 
                    className="text-gray-400 transition-colors duration-300 hover:text-primary text-sm flex items-center group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="group-hover:underline">hello@johndoe.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+1234567890" 
                    className="text-gray-400 transition-colors duration-300 hover:text-primary text-sm flex items-center group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="group-hover:underline">(123) 456-7890</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 transition-colors duration-300 hover:text-primary text-sm flex items-center group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="group-hover:underline">San Francisco, CA</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright and back to top */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {year} John Doe. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-400">
              <span>Built with </span>
              <motion.span 
                className="text-red-500 mx-1"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >❤</motion.span> 
              <span> using Next.js & Tailwind CSS</span>
            </div>
            
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 md:mt-0 flex items-center gap-1 p-1 text-gray-400 hover:text-white transition-colors"
              whileHover={{ y: -3 }}
            >
              <span className="text-xs">Back to top</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 