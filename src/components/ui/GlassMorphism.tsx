"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassMorphismProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'blue' | 'purple' | 'teal' | 'pink' | 'default';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hover?: boolean;
  animate?: boolean;
}

const GlassMorphism = ({
  children,
  className = '',
  intensity = 'medium',
  color = 'default',
  border = true,
  rounded = 'lg',
  hover = false,
  animate = false,
}: GlassMorphismProps) => {
  // Intensity levels (backdrop blur and background opacity)
  const intensityMap = {
    low: { blur: 'backdrop-blur-sm', bg: 'bg-opacity-10 dark:bg-opacity-10' },
    medium: { blur: 'backdrop-blur-md', bg: 'bg-opacity-20 dark:bg-opacity-20' },
    high: { blur: 'backdrop-blur-lg', bg: 'bg-opacity-30 dark:bg-opacity-30' },
  };

  // Color variants
  const colorMap = {
    blue: 'bg-blue-500/10 dark:bg-blue-400/10',
    purple: 'bg-purple-500/10 dark:bg-purple-400/10',
    teal: 'bg-teal-500/10 dark:bg-teal-400/10',
    pink: 'bg-pink-500/10 dark:bg-pink-400/10',
    default: 'bg-white/10 dark:bg-gray-700/10',
  };

  // Border styles
  const borderStyles = border 
    ? color === 'default' 
      ? 'border border-white/20 dark:border-gray-700/20'
      : `border border-${color}-500/20 dark:border-${color}-400/20`
    : '';

  // Rounded corners
  const roundedMap = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  // Animation variants
  const variants = {
    initial: { 
      opacity: animate ? 0 : 1,
      y: animate ? 10 : 0,
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      }
    },
    hover: hover ? {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    } : {}
  };

  return (
    <motion.div
      className={`
        ${intensityMap[intensity].blur} 
        ${intensityMap[intensity].bg} 
        ${colorMap[color]} 
        ${borderStyles} 
        ${roundedMap[rounded]} 
        shadow-lg 
        ${className}
      `}
      initial="initial"
      animate="animate"
      whileHover={hover ? "hover" : undefined}
      variants={variants}
    >
      {/* Inner gradient effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[100%] opacity-20 bg-gradient-radial from-white/20 via-transparent to-transparent" />
      </div>
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassMorphism; 