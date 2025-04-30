"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  id: string;
  title: string;
  summary: string;
  slug: string;
  coverImage?: string;
  publishedAt: Date;
  readingTime?: number;
  tags?: string[];
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

const BlogCard = ({
  id,
  title,
  summary,
  slug,
  coverImage,
  publishedAt,
  readingTime = 5,
  tags = [],
}: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {coverImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={coverImage || '/images/blog-placeholder.jpg'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{formatDate(publishedAt)}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {summary}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Link 
                key={index}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        <Link 
          href={`/blog/${slug}`}
          className="inline-flex items-center text-primary hover:text-blue-700 font-medium transition-colors"
        >
          Read article
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard; 