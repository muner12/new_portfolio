"use client";

import { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  rounded?: 'full' | 'md' | 'lg' | 'xl' | 'none';
}

const MagneticButton = ({ 
  children, 
  className = '',
  strength = 20,
  onClick,
  rounded = 'lg'
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Calculate magnet effect (stronger when closer to center)
    setPosition({ 
      x: distanceX / (isHovered ? strength : 100), 
      y: distanceY / (isHovered ? strength : 100) 
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Calculate the border-radius value based on the rounded prop
  const getBorderRadius = () => {
    switch (rounded) {
      case 'full': return 'rounded-full';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      case 'none': return '';
      default: return 'rounded-lg';
    }
  };

  return (
    <motion.div
      ref={buttonRef}
      className={`relative inline-block overflow-hidden cursor-pointer ${getBorderRadius()} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1
      }}
    >
      <motion.div 
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.05 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MagneticButton; 