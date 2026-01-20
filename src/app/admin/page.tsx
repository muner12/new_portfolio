import React from 'react';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Project from '@/models/Project';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import { getAuthUser } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  await connectDB();
  
  // Get authenticated user
  const user = await getAuthUser();
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>You need to be logged in as an admin to view this page.</p>
      </div>
    );
  }
  
  // Fetch stats
  const [
    blogCount,
    projectCount,
    experienceCount,
    educationCount,
    publishedBlogs,
    draftBlogs
  ] = await Promise.all([
    Blog.countDocuments({}),
    Project.countDocuments({}),
    Experience.countDocuments({}),
    Education.countDocuments({}),
    Blog.countDocuments({ status: 'published' }),
    Blog.countDocuments({ status: 'draft' })
  ]);
  
  // Fetch latest blogs
  const latestBlogs = await Blog.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title slug status createdAt')
    .lean();
  
  // Fetch latest projects
  const latestProjects = await Project.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title featured createdAt')
    .lean();

  // Dashboard cards data
  const statCards = [
    {
      title: 'Total Blogs',
      value: blogCount,
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
      color: 'bg-blue-500',
      link: '/admin/blogs'
    },
    {
      title: 'Projects',
      value: projectCount,
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      color: 'bg-purple-500',
      link: '/admin/projects'
    },
    {
      title: 'Experience',
      value: experienceCount,
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: 'bg-green-500',
      link: '/admin/experience'
    },
    {
      title: 'Education',
      value: educationCount,
      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
      color: 'bg-yellow-500',
      link: '/admin/education'
    }
  ];
  
  // Quick action links
  const quickActions = [
    { 
      title: 'New Blog Post', 
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      link: '/admin/blogs/create'
    },
    { 
      title: 'Add Project', 
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/admin/projects/create'
    },
    { 
      title: 'Update Profile', 
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      link: '/admin/profile'
    },
    { 
      title: 'View Website', 
      icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
      link: '/',
      external: true
    }
  ];
  
  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {user.name || user.email}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 ${card.color} rounded-full`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</h2>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href={card.link}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              href={action.link}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent blogs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Blog Posts</h2>
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span className="text-gray-600 dark:text-gray-400">Published: {publishedBlogs}</span>
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
                <span className="text-gray-600 dark:text-gray-400">Drafts: {draftBlogs}</span>
              </span>
            </div>
          </div>
          
          {latestBlogs.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestBlogs.map((blog: any, index: number) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{blog.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(blog.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4">No blog posts yet.</p>
          )}
          
          <div className="mt-4">
            <Link 
              href="/admin/blogs"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all blogs
            </Link>
          </div>
        </div>
        
        {/* Recent projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Recent Projects</h2>
          
          {latestProjects.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {latestProjects.map((project: any, index: number) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{project.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(project.createdAt)}</p>
                    </div>
                    {project.featured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 py-4">No projects yet.</p>
          )}
          
          <div className="mt-4">
            <Link 
              href="/admin/projects"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 