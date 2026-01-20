"use client";

import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  coverImage?: string;
  publishedAt: string;
  readingTime?: number;
  tags?: string[];
}

interface BlogListProps {
  blogs: BlogPost[];
}

export default function BlogList({ blogs }: BlogListProps) {
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {blogs.map((post) => (
        <motion.div key={post._id} variants={item}>
          <BlogCard
            id={post._id}
            title={post.title}
            summary={post.summary}
            slug={post.slug}
            coverImage={post.coverImage}
            publishedAt={new Date(post.publishedAt)}
            readingTime={post.readingTime}
            tags={post.tags}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

