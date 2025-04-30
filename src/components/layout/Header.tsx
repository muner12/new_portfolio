"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // Mobile menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  // Hover animation for desktop nav items
  const hoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.2 },
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <motion.a 
              className="flex items-center space-x-2 font-bold text-xl text-gray-900 dark:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <span className="hidden sm:inline">John Doe</span>
            </motion.a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} legacyBehavior>
                  <motion.a
                    className={`text-sm font-medium relative py-2 px-1 transition-colors ${
                      isActive 
                        ? 'text-primary dark:text-primary' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    whileHover={hoverAnimation}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.a>
                </Link>
              );
            })}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
            >
              <ThemeToggle />
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={mobileMenuOpen ? "open" : "closed"}
                className="w-6 h-5 flex flex-col justify-between"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 },
                  }}
                  className="w-full h-0.5 bg-current block rounded-full"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  className="w-full h-0.5 bg-current block rounded-full"
                ></motion.span>
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 },
                  }}
                  className="w-full h-0.5 bg-current block rounded-full"
                ></motion.span>
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden overflow-hidden"
            >
              <motion.nav className="mt-4 py-4 border-t border-gray-200 dark:border-gray-800">
                <ul className="space-y-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.li key={link.name} variants={itemVariants}>
                        <Link href={link.href} legacyBehavior>
                          <a
                            className={`block py-2 text-sm font-medium transition-colors ${
                              isActive 
                                ? 'text-primary dark:text-primary' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.name}
                          </a>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </header>
  );
} 