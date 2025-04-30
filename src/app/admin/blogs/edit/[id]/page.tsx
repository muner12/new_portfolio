"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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

// Mock blog posts data for demonstration
const mockBlogPosts = {
  '1': {
    _id: '1',
    title: 'Getting Started with Next.js 14',
    slug: 'getting-started-with-nextjs-14',
    summary: 'Learn how to set up a Next.js 14 project with TypeScript and Tailwind CSS.',
    content: '# Getting Started with Next.js 14\n\nNext.js 14 introduces several new features and improvements...',
    coverImage: '/images/blog-placeholder.jpg',
    categories: ['3', '1'],
    tags: ['Next.js', 'JavaScript', 'React', 'Web Development'],
    featured: true,
    status: 'published',
    publishedAt: new Date(2023, 10, 15).toISOString(),
    viewCount: 423,
    uniqueViewCount: 310,
    readingTime: 8,
    createdAt: new Date(2023, 10, 15).toISOString(),
    updatedAt: new Date(2023, 10, 16).toISOString(),
  },
  '2': {
    _id: '2',
    title: 'Mastering TypeScript for React Development',
    slug: 'mastering-typescript-for-react',
    summary: 'Explore advanced TypeScript features for React applications.',
    content: '# Mastering TypeScript for React Development\n\nTypeScript offers many benefits for React developers...',
    coverImage: '/images/blog-placeholder.jpg',
    categories: ['2', '6'],
    tags: ['TypeScript', 'React', 'Development'],
    featured: false,
    status: 'draft',
    viewCount: 0,
    uniqueViewCount: 0,
    readingTime: 12,
    createdAt: new Date(2023, 10, 10).toISOString(),
    updatedAt: new Date(2023, 10, 10).toISOString(),
  },
  '3': {
    _id: '3',
    title: 'The Power of Tailwind CSS',
    slug: 'power-of-tailwind-css',
    summary: 'Discover how Tailwind CSS can improve your development workflow.',
    content: '# The Power of Tailwind CSS\n\nTailwind CSS has revolutionized the way developers approach styling...',
    coverImage: '/images/blog-placeholder.jpg',
    categories: ['4', '1'],
    tags: ['CSS', 'Tailwind', 'UI'],
    featured: false,
    status: 'archived',
    publishedAt: new Date(2023, 9, 25).toISOString(),
    viewCount: 210,
    uniqueViewCount: 180,
    readingTime: 6,
    createdAt: new Date(2023, 9, 25).toISOString(),
    updatedAt: new Date(2023, 9, 26).toISOString(),
  },
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [blogPost, setBlogPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, you would fetch from your API
        // const response = await fetch(`/api/blogs/${postId}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch blog post');
        // }
        // const data = await response.json();
        
        // For demonstration, we'll use the mock data
        if (!mockBlogPosts[postId as keyof typeof mockBlogPosts]) {
          throw new Error('Blog post not found');
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBlogPost(mockBlogPosts[postId as keyof typeof mockBlogPosts]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [postId]);

  const handleSave = async (postData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real implementation, you would send the data to your API
      // const response = await fetch(`/api/blogs/${postId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(postData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update blog post');
      // }
      
      // const data = await response.json();
      
      // For demonstration, we'll simulate a successful save
      console.log('Blog post updated:', postData);
      
      // Wait a moment to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the local state with the new data
      setBlogPost({
        ...blogPost,
        ...postData,
        updatedAt: new Date().toISOString(),
      });
      
      setIsSubmitting(false);
      
      // Optional: Redirect back to the list
      // router.push('/admin/blogs');
      
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/admin/blogs')}
          className="text-primary hover:underline"
        >
          Back to Blog Posts
        </button>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md mb-4">
          Blog post not found
        </div>
        <button
          onClick={() => router.push('/admin/blogs')}
          className="text-primary hover:underline"
        >
          Back to Blog Posts
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/blogs')}
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
          Edit Blog Post
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <BlogPostEditor 
          post={blogPost}
          onSave={handleSave}
          categories={mockCategories}
        />
      </div>
    </div>
  );
} 