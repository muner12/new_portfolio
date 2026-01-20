import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Category from '@/models/Category';
import { requireAdmin, getAuthUser, AuthError } from '@/lib/auth';

// GET /api/blogs/[id] - Get single blog post
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const id = params.id;
    
    // Try to find the blog by ID first, then by slug if not found
    let blog = await Blog.findById(id)
      .populate('categories', 'name');
    
    // If not found by ID, try to find by slug
    if (!blog) {
      blog = await Blog.findOne({ slug: id })
        .populate('categories', 'name');
    }
    
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
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update blog post (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure only admins can update blogs
    const admin = await requireAdmin(req);
    
    await connectDB();
    
    const id = params.id;
    const blogData = await req.json();
    
    // Find blog post
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Update blog post fields
    const fieldsToUpdate = [
      'title', 'summary', 'content', 'coverImage', 'featuredImage', 
      'embedVideo', 'categories', 'tags', 'featured', 'status', 
      'scheduledFor', 'seoTitle', 'seoDescription', 'ogImage', 
      'canonicalUrl', 'tableOfContents'
    ];
    
    // Update allowed fields
    fieldsToUpdate.forEach(field => {
      if (blogData[field] !== undefined) {
        blog[field] = blogData[field];
      }
    });
    
    // Add to revision history if content is updated
    if (blogData.content && blogData.content !== blog.content) {
      if (!blog.revisionHistory) {
        blog.revisionHistory = [];
      }
      
      blog.revisionHistory.push({
        content: blog.content,
        updatedAt: new Date(),
        changeDescription: blogData.changeDescription || 'Content updated'
      });
    }
    
    // Check if status changed to published
    if (blogData.status === 'published' && blog.status !== 'published') {
      blog.publishedAt = new Date();
    }
    
    // Save updated blog
    const updatedBlog = await blog.save();
    
    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete blog post (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure only admins can delete blogs
    const admin = await requireAdmin(req);
    
    await connectDB();
    
    const id = params.id;
    
    // Find and delete blog
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 