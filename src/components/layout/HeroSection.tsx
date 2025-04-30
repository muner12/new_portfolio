"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle properties
    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(100, Math.floor(window.innerWidth / 15));
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150
    };

    // Track mouse position
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      angle: number;
      distance: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 5 + 1;
        this.density = Math.random() * 30 + 1;
        this.distance = 0;
        this.angle = 0;
        
        // Color palette for particles
        const colors = ['rgba(66, 133, 244, 0.7)', 'rgba(219, 68, 55, 0.7)', 'rgba(244, 180, 0, 0.7)', 'rgba(15, 157, 88, 0.7)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        if (mouse.x == null || mouse.y == null) {
          // Return to original position when mouse is out
          const dx = this.baseX - this.x;
          const dy = this.baseY - this.y;
          this.x += dx * 0.05;
          this.y += dy * 0.05;
          return;
        }
        
        // Calculate distance between particle and mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);
        
        // Mouse repel effect
        const maxDistance = mouse.radius;
        const force = (maxDistance - this.distance) / maxDistance;
        const forceDirectionX = Math.cos(this.angle) * force * this.density * -1;
        const forceDirectionY = Math.sin(this.angle) * force * this.density * -1;
        
        if (this.distance < mouse.radius) {
          this.x += forceDirectionX;
          this.y += forceDirectionY;
        } else {
          // Return to original position
          const dx = this.baseX - this.x;
          const dy = this.baseY - this.y;
          this.x += dx * 0.05;
          this.y += dy * 0.05;
        }
      }
    }

    // Create particles
    function init() {
      if (!canvas) return;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }
    init();

    // Animation loop
    function animate() {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw lines between particles
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.5 - distance/200})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
        
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      requestAnimationFrame(animate);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
      });
      window.removeEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
      });
    };
  }, []);

  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: 90 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  const headingText = "Creative Developer & Designer";
  const headingArray = Array.from(headingText);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Background canvas for particle effect */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Abstract shapes */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
      <div className="absolute bottom-[30%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl" />
      
      {/* Hero content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full container mx-auto px-6 py-12">
        <div className="w-full md:w-1/2 text-white space-y-6 mb-10 md:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl font-light text-blue-400 mb-2"
          >
            Hello, I'm
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            Bakht Munir
          </motion.h1>
          
          <motion.h2 
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap text-xl md:text-3xl font-medium text-gray-300"
          >
            {headingArray.map((letter, index) => (
              <motion.span key={index} variants={letterVariants}>
                {letter === " " ? <span>&nbsp;</span> : letter}
              </motion.span>
            ))}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-lg max-w-md"
          >
            I create stunning digital experiences that combine beautiful design with clean, functional code.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex space-x-4 pt-4"
          >
            <Link href="/projects" legacyBehavior>
              <motion.a 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </Link>
            
            <Link href="/contact" legacyBehavior>
              <motion.a 
                className="px-6 py-3 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex space-x-5 pt-6"
          >
            {/* Social icons */}
            {[
              { name: 'github', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
              { name: 'twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
              { name: 'linkedin', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            ].map((social, i) => (
              <a 
                key={i}
                href={`https://${social.name}.com`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="w-full md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full">
            {/* Profile image with gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow" />
            <div className="absolute inset-1 bg-gray-900 rounded-full overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Profile"
                width={400}
                height={400}
                className="rounded-full object-cover"
                priority
              />
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 bg-blue-500 rounded-lg p-3 shadow-lg"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0] 
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-purple-500 rounded-lg p-3 shadow-lg"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0] 
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Mouse scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-gray-400 text-sm mb-2">Scroll Down</span>
            <motion.div 
              className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1.5 h-3 bg-white rounded-full mt-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 