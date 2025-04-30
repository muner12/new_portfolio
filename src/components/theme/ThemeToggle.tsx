"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // After mounting, we can safely show the toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
  }

  const isDark = theme === 'dark';

  // SVG path variants for sun/moon morphing
  const pathVariants = {
    dark: {
      d: "M12 3a1 1 0 0 1 1 1v1.06A10.063 10.063 0 0 1 22 15c0 .085-.011.17-.011.256A1 1 0 0 1 23 16.37v.26a1 1 0 0 1-1 1v1a1 1 0 0 1-1.58.81A10.075 10.075 0 0 1 12 23c-5.514 0-10-4.486-10-10a10.074 10.074 0 0 1 4.42-8.32A1 1 0 0 1 7 4h3a1 1 0 0 1 1-1h1Z",
      fill: "#CBD5E1",
    },
    light: {
      d: "M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm11-7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1Zm-11-9a1 1 0 0 0 1-1V1a1 1 0 1 0-2 0v1a1 1 0 0 0 1 1Zm0 19a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0v-1a1 1 0 0 0-1-1ZM3.513 4.927a1 1 0 0 0-1.414 1.414l.707.707a1 1 0 1 0 1.414-1.414l-.707-.707Zm17.07 14.142a1 1 0 1 0-1.414 1.414l.707.707a1 1 0 1 0 1.414-1.414l-.707-.707ZM3 12a1 1 0 0 0-1-1H1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1Zm16.95-7.777a1 1 0 0 0 1.414 0l.707-.707a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 0 0 0 1.414Zm-1.414 15.556a1 1 0 0 0 0 1.414l.707.707a1 1 0 1 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 0ZM8.464 2.808a1 1 0 0 0-1.414 0l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Z",
      fill: "#FCD34D",
    }
  };

  return (
    <motion.button
      className="relative h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-inner focus:outline-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stars (only visible in dark mode) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute inline-block h-1 w-1 rounded-full bg-yellow-200"
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * 20 - 10 + (i % 2 === 0 ? 10 : -10),
              y: Math.random() * 20 - 10 + (i % 2 === 0 ? -10 : 10),
            }}
            animate={isHovered && isDark ? {
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                delay: Math.random() * 1,
              },
            } : {}}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Sun/Moon animated icon */}
      <motion.div
        animate={{
          rotate: isDark ? 25 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative"
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="absolute inset-0"
          animate={{ opacity: isDark ? 0 : 1 }}
        >
          <motion.path
            variants={pathVariants}
            initial="light"
            animate="light"
            fill="currentColor"
            className="text-yellow-400"
          />
        </motion.svg>
        
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="absolute inset-0"
          animate={{ opacity: isDark ? 1 : 0 }}
        >
          <motion.path
            variants={pathVariants}
            initial="dark"
            animate="dark"
            fill="currentColor"
            className="text-gray-200"
          />
        </motion.svg>
      </motion.div>

      {/* Background color transition effect */}
      <motion.div
        className="absolute inset-0 bg-yellow-400 dark:bg-gray-700"
        initial={false}
        animate={{
          opacity: isDark ? 0 : 0.15,
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Rim highlight */}
      <motion.div 
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isDark 
            ? "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.05)"
            : "inset 0 0 0 1px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)"
        }}
      />
    </motion.button>
  );
} 