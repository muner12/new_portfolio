"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostEditor from '@/components/blog/BlogPostEditor';

// This would typically come from your API
const mockCategories = [
  { _id: '1', name: 'Web Development' },
  { _id: '2', name: 'React' },
  { _id: '3', name: 'Next.js' },
  { _id: '4', name: 'UI/UX Design' },
  { _id: '5', name: 'JavaScript' },
  { _id: '6', name: 'TypeScript' },
];

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (postData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real implementation, you would send the data to your API
      // const response = await fetch('/api/blogs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(postData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create blog post');
      // }
      
      // const data = await response.json();
      
      // For demonstration, we'll simulate a successful save
      console.log('Blog post saved:', postData);
      
      // Wait a moment to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirect to the blog list
      router.push('/admin/blogs');
      
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Back to Blog Posts
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Blog Post
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <BlogPostEditor 
          onSave={handleSave}
          categories={mockCategories}
        />
      </div>
    </div>
  );
} 