"use client";

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

type ScrollProgressProps = {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
};

const ScrollProgress = ({ 
  color = 'from-blue-500 to-purple-600', 
  height = 3,
  position = 'top' 
}: ScrollProgressProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show progress bar after scrolling a bit
      setIsVisible(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 origin-left bg-gradient-to-r ${color}`}
      style={{
        scaleX,
        height: `${height}px`,
        backgroundColor: 'transparent',
        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default ScrollProgress; 