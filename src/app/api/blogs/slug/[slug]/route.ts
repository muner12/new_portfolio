import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth';

// GET /api/blogs/slug/[slug] - Get blog post by slug
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    // Find blog by slug
    const blog = await Blog.findOne({ slug })
      .populate('categories', 'name');
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Check if user is admin for non-published posts
    const user = await getAuthUser(req);
    if (blog.status !== 'published' && (!user || user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized access to draft post' },
        { status: 403 }
      );
    }
    
    // Increment view count for published posts
    if (blog.status === 'published') {
      blog.viewCount += 1;
      await blog.save();
    }
    
    return NextResponse.json(blog, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching blog post by slug:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog post';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 