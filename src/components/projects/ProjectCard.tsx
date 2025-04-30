"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
  slug: string;
  featured?: boolean;
}

const ProjectCard = ({
  id,
  title,
  description,
  image,
  technologies,
  githubLink,
  demoLink,
  slug,
  featured = false,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for tilt effect
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  // Tag animation variants
  const tagVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * i,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-full perspective-1000 ${featured ? 'col-span-2 row-span-2' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden transform-gpu group"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.3)"
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        transition={{ duration: 0.3 }}
      >
        {/* Glassmorphism border effect */}
        <div className="absolute inset-0 border border-white/10 rounded-xl" />
        
        {/* Background glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-xl transform translate-y-1/2" />
        </div>
        
        {/* Image */}
        <div className="relative h-60 md:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-70" />
          <motion.div
            className="w-full h-full"
            style={{
              scale: isHovered ? 1.1 : 1,
              translateZ: isHovered ? "20px" : "0px"
            }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={image}
              alt={title}
              fill
              quality={90}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Featured
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <motion.div 
          className="relative p-6 z-10"
          style={{
            translateZ: isHovered ? "40px" : "0px",
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            {/* Tech badge - only show main tech on smaller cards */}
            {!featured && technologies.length > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {technologies[0]}
              </span>
            )}
          </div>
          
          <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
            {description}
          </p>
          
          {/* Technologies */}
          {featured && (
            <div className="flex flex-wrap gap-2 mb-6">
              {technologies.slice(0, 5).map((tech, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={tagVariants}
                  initial={isHovered ? "hidden" : "visible"}
                  animate={isHovered ? "visible" : "visible"}
                  className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-gray-700 shadow-sm"
                >
                  {tech}
                </motion.span>
              ))}
              {technologies.length > 5 && (
                <motion.span
                  custom={5}
                  variants={tagVariants}
                  initial={isHovered ? "hidden" : "visible"}
                  animate={isHovered ? "visible" : "visible"}
                  className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-gray-700 shadow-sm"
                >
                  +{technologies.length - 5} more
                </motion.span>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link href={`/projects/${slug}`} legacyBehavior>
              <motion.a
                className="text-primary hover:text-primary/80 font-medium text-sm md:text-base flex items-center group/link"
                whileHover={{ x: 5 }}
              >
                View Details
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 transform transition-transform group-hover/link:translate-x-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </Link>
            
            <div className="flex space-x-3">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`GitHub repository for ${title}`}
                >
                  <motion.svg
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </a>
              )}
              
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Live demo for ${title}`}
                >
                  <motion.svg
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </motion.svg>
                </a>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 60%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: isHovered ? ["0% 0%", "200% 200%"] : "0% 0%",
          }}
          transition={{ duration: 1, ease: "easeInOut", repeat: 0 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard; 