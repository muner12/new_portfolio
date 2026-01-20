import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import BlogList from '@/components/blog/BlogList';

// Define blog post interface
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

// Define blog list response interface
interface BlogListResponse {
  blogs: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Define metadata for the page
export const metadata: Metadata = {
  title: 'Blog | My Portfolio',
  description: 'Read my latest articles on web development, programming, and technology.',
};

// Fetch blog posts from API
async function fetchBlogPosts(page = 1, limit = 12): Promise<BlogListResponse | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${protocol}://${host}`;
    
    const res = await fetch(
      `${baseUrl}/api/blogs?page=${page}&limit=${limit}&status=published`, 
      { cache: 'no-store' } // Don't cache this request
    );
    
    if (!res.ok) {
      console.error('Failed to fetch blog posts', res.status);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null;
  }
}

// Blog listing page component
export default async function BlogPage({ 
  searchParams 
}: { 
  searchParams: { page?: string; tag?: string; category?: string } 
}) {
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  
  // Fetch blog posts
  const data = await fetchBlogPosts(page, limit);
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to load blog posts</h2>
          <p className="mb-4">There was an error loading the blog posts. Please try again later.</p>
          <Link 
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  
  const { blogs, pagination } = data;
  
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Thoughts, tutorials, and insights about programming, web development, and technology
        </p>
      </div>
      
      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No blog posts found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back later for new content!
          </p>
        </div>
      ) : (
        <>
          {/* Blog post grid */}
          <BlogList blogs={blogs} />
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                {pagination.hasPrevPage && (
                  <Link
                    href={`/blog?page=${page - 1}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      pageNum === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } transition-colors`}
                  >
                    {pageNum}
                  </Link>
                ))}
                
                {pagination.hasNextPage && (
                  <Link
                    href={`/blog?page=${page + 1}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
