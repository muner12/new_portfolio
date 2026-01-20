import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin, AuthError } from '@/lib/auth';

// POST /api/blogs/create - Create a new blog post (admin only)
export async function POST(req: NextRequest) {
  try {
    // Ensure only admins can create blogs
    const admin = await requireAdmin(req);
    
    await connectDB();
    
    // Parse request body
    const blogData = await req.json();
    
    // Create new blog post
    const blog = new Blog({
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      uniqueViewCount: 0
    });
    
    // If blog is being published directly, set publishedAt
    if (blog.status === 'published') {
      blog.publishedAt = new Date();
    }
    
    // Save blog to database
    const savedBlog = await blog.save();
    
    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error: unknown) {
    // Handle authentication errors
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    // Handle validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Handle general errors
    console.error('Error creating blog post:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 