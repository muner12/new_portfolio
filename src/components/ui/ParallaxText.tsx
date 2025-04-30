"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxTextProps {
  children: string;
  baseVelocity?: number;
  className?: string;
  direction?: 'left' | 'right';
  repeat?: number;
}

export default function ParallaxText({ 
  children, 
  baseVelocity = 5, 
  className = "", 
  direction = 'right',
  repeat = 3
}: ParallaxTextProps) {
  const baseX = useRef(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothVelocity = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400
  });
  
  const directionFactor = direction === "right" ? 1 : -1;
  
  // Generate the text repeating based on repeat prop
  const text = Array(repeat).fill(children).join(" • ");
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center in percentage
      const x = ((e.clientX - centerX) / (rect.width / 2)) * 10; // Max 10px movement
      const y = ((e.clientY - centerY) / (rect.height / 2)) * 5; // Max 5px movement
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate velocity based on scroll
  const x = useTransform(
    smoothVelocity, 
    [0, 1], 
    [0, 1000 * directionFactor]
  );
  
  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden m-0 whitespace-nowrap flex flex-nowrap items-center ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="flex whitespace-nowrap flex-nowrap items-center tracking-tight"
        style={{ 
          x, 
          rotateX: -mousePosition.y,
          rotateY: mousePosition.x,
          transformStyle: 'preserve-3d'
        }}
      >
        <span className="block mr-4">{text}</span>
        <span className="block mr-4">{text}</span>
        <span className="block mr-4">{text}</span>
      </motion.div>
    </div>
  );
} 