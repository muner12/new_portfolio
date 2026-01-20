import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import Category from '@/models/Category';
import { isAdmin, getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';
import { generateSlug } from '@/lib/utils';

// GET /api/blogs - Get list of blog posts (paginated)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Ensure Category model is registered - just importing and referencing it should work
    // The import at the top should register it, but we reference it here to ensure it's loaded
    const _ = Category;

    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');

    // Skip and limit for pagination
    const skip = (page - 1) * limit;

    // Build the filter object
    const filter: any = {};

    // Check if user is admin - only admins can see draft posts
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      // Non-admins can only see published posts
      filter.status = 'published';
    } else if (status) {
      // Admins can filter by status
      filter.status = status;
    }

    // Filter by category if provided
    if (category) {
      filter.categories = category;
    }

    // Filter by tag if provided
    if (tag) {
      filter.tags = tag;
    }

    // Search in title and content if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { summary: searchRegex }
      ];
    }

    // Execute the query
    // Only populate categories if the model is registered
    const query = Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-revisionHistory'); // Exclude revision history for performance
    
    // Only populate if Category model is registered
    if (mongoose.models.Category) {
      query.populate('categories', 'name');
    }
    
    const blogs = await query.exec();

    // Get total count for pagination
    const total = await Blog.countDocuments(filter);

    // Calculate pagination values
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog post
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthUser(req);
    
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create blog posts' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Get request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.title);
    }
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      // Make slug unique by adding a timestamp
      body.slug = `${body.slug}-${Date.now().toString().slice(-6)}`;
    }
    
    // Calculate reading time if content is provided
    if (body.content && !body.readingTime) {
      // Estimate reading time based on content length
      // Assume average reading speed of 200 words per minute
      const wordCount = body.content.split(/\s+/).length;
      body.readingTime = Math.ceil(wordCount / 200);
    }
    
    // Set default status if not provided
    if (!body.status) {
      body.status = 'draft';
    }
    
    // Set published date if status is published
    if (body.status === 'published' && !body.publishedAt) {
      body.publishedAt = new Date();
    }
    
    // Add user ID to the blog post data
    body.userId = user.id;
    
    // Create new blog post
    const newBlog = new Blog(body);
    await newBlog.save();
    
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    // Handle validation error
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
