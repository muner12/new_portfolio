"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  rotateRange?: [number, number];
  scaleRange?: [number, number];
  duration?: number;
  delay?: number;
  repeatType?: "loop" | "reverse" | "mirror";
}

const FloatingElement = ({
  children,
  className = '',
  xRange = [-10, 10],
  yRange = [-10, 10],
  rotateRange = [-5, 5],
  scaleRange = [0.95, 1.05],
  duration = 6,
  delay = 0,
  repeatType = "mirror"
}: FloatingElementProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1
      }}
      animate={{
        x: [xRange[0], xRange[1]],
        y: [yRange[0], yRange[1]],
        rotate: [rotateRange[0], rotateRange[1]],
        scale: [scaleRange[0], scaleRange[1]]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement; 