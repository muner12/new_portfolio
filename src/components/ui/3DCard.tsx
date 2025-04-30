"use client";

import { useState, useRef, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  perspective?: number;
  tiltMaxAngle?: number;
  tiltReverse?: boolean;
  tiltScale?: number;
  glareEnable?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  gyroEnabled?: boolean;
}

const TiltCard = ({
  children,
  className = '',
  perspective = 1000,
  tiltMaxAngle = 15,
  tiltReverse = false,
  tiltScale = 1.05,
  glareEnable = true,
  glareMaxOpacity = 0.3,
  glareColor = '#ffffff',
  gyroEnabled = false
}: TiltCardProps) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate tilt angles
    const tiltX = (tiltReverse ? 1 : -1) * (mouseY / (rect.height / 2)) * tiltMaxAngle;
    const tiltY = (tiltReverse ? -1 : 1) * (mouseX / (rect.width / 2)) * tiltMaxAngle;
    
    // Calculate glare effect position
    const glareX = (mouseX / rect.width) * 100;
    const glareY = (mouseY / rect.height) * 100;

    setTilt({ x: tiltX, y: tiltY, scale: tiltScale });
    setGlarePosition({ x: glareX, y: glareY });
  };

  // Handle device orientation for mobile devices
  useEffect(() => {
    if (!gyroEnabled) return;

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!e.beta || !e.gamma || !isHovered || !cardRef.current) return;
      
      // Beta is for front/back tilt in the range [-180, 180]
      // Gamma is for left/right tilt in the range [-90, 90]
      const beta = Math.min(Math.max(e.beta, -90), 90); // Restrict to [-90, 90]
      const gamma = Math.min(Math.max(e.gamma, -45), 45); // Restrict to [-45, 45]
      
      // Normalize to the range [-1, 1]
      const x = gamma / 45;
      const y = beta / 90;
      
      // Apply tilt
      const tiltX = (tiltReverse ? 1 : -1) * y * tiltMaxAngle;
      const tiltY = (tiltReverse ? -1 : 1) * x * tiltMaxAngle;
      
      setTilt({ x: tiltX, y: tiltY, scale: tiltScale });
      setGlarePosition({ x: (x + 1) / 2 * 100, y: (y + 1) / 2 * 100 });
    };
    
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [gyroEnabled, isHovered, tiltMaxAngle, tiltReverse, tiltScale]);

  // Reset tilt when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, scale: 1 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: `${perspective}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? tilt.scale : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {/* Main content */}
      <div 
        className="relative z-10 h-full w-full"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </div>
      
      {/* Glare effect */}
      {glareEnable && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 80%)`,
            opacity: isHovered ? glareMaxOpacity : 0,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
};

export default TiltCard; 