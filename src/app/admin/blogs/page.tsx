"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, this would fetch from your API
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // This is a placeholder - in a real app you would fetch from your API
        // const response = await fetch('/api/blogs/admin');
        // const data = await response.json();
        
        // For demonstration purposes, we'll use dummy data
        const dummyData: BlogPost[] = [
          {
            _id: '1',
            title: 'Getting Started with Next.js 14',
            slug: 'getting-started-with-nextjs-14',
            status: 'published',
            createdAt: new Date(2023, 10, 15).toISOString(),
            updatedAt: new Date(2023, 10, 16).toISOString(),
          },
          {
            _id: '2',
            title: 'Mastering TypeScript for React Development',
            slug: 'mastering-typescript-for-react',
            status: 'draft',
            createdAt: new Date(2023, 10, 10).toISOString(),
            updatedAt: new Date(2023, 10, 10).toISOString(),
          },
          {
            _id: '3',
            title: 'The Power of Tailwind CSS',
            slug: 'power-of-tailwind-css',
            status: 'archived',
            createdAt: new Date(2023, 9, 25).toISOString(),
            updatedAt: new Date(2023, 9, 26).toISOString(),
          },
        ];
        
        setBlogs(dummyData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load blog posts');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Blog Posts
        </h1>
        <Link href="/admin/blogs/new" legacyBehavior>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Create New Post
          </motion.a>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            No blog posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Create your first blog post to get started
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {blog.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      /{blog.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(blog.status)}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(blog.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/blogs/edit/${blog._id}`} className="text-primary hover:text-primary/80 mr-4">
                      Edit
                    </Link>
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 