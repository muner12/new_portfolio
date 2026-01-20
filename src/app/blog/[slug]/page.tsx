import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import BlogContent from '@/components/blog/BlogContent';
import { Metadata, ResolvingMetadata } from 'next';

// Define interface for blog post data
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  readingTime?: number;
  author?: {
    name: string;
    image?: string;
  };
  tags?: string[];
  categories?: Array<{ _id: string; name: string }>;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch blog post
  const post = await fetchBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found',
    };
  }
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    openGraph: {
      images: [post.ogImage || post.coverImage || '/images/blog-placeholder.jpg'],
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.summary,
      type: 'article',
    },
  };
}

// Fetch blog post data
async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || `${protocol}://${host}`;
    
    const res = await fetch(`${baseUrl}/api/blogs/slug/${slug}`, { 
      cache: 'no-store'  // Don't cache this request
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Format date for display
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Blog post header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="mb-6">
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.categories.map((category) => (
                <Link 
                  key={category._id} 
                  href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {post.summary}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <Image 
                    src={post.author.image} 
                    alt={post.author.name} 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">{post.author.name.charAt(0)}</span>
                  </div>
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readingTime || 5} min read</span>
            </div>
          </div>
        </div>
        
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-[60vh] mb-12 rounded-xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
      
      {/* Blog content */}
      <article className="max-w-3xl mx-auto">
        <BlogContent content={post.content} />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link 
                  key={index} 
                  href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
