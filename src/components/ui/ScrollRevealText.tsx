"use client";

import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealTextProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerChildren?: number;
  once?: boolean;
  delay?: number;
}

const ScrollRevealText = ({
  children,
  className = '',
  threshold = 0.1,
  direction = 'up',
  staggerChildren = 0.02,
  once = true,
  delay = 0
}: ScrollRevealTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once 
  });

  // Split text into words and characters
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  // Set animation variants based on direction
  const getVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'down':
        return {
          hidden: { y: -20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'left':
        return {
          hidden: { x: 20, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'right':
        return {
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      default:
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = getVariants();

  if (typeof children !== 'string') {
    // Handle non-string children (like components)
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0, x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0 },
          visible: { 
            opacity: 1, 
            y: 0, 
            x: 0,
            transition: { duration: 0.5, delay }
          }
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {wordIndex > 0 && <span>&nbsp;</span>}
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              variants={wordVariants}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 100,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default ScrollRevealText; 