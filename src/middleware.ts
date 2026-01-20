import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/api/profile',
  '/api/experiences',
  '/api/education',
  '/api/projects',
  '/api/certificates',
  '/api/blogs',
  '/api/analytics'
];

// List of admin-only routes that require admin role
const adminRoutes = [
  '/admin',
  '/api/blogs/create',
  '/api/blogs/update',
  '/api/blogs/delete',
  '/api/experiences/create',
  '/api/experiences/update',
  '/api/experiences/delete',
  '/api/education/create',
  '/api/education/update',
  '/api/education/delete',
  '/api/projects/create',
  '/api/projects/update',
  '/api/projects/delete',
  '/api/certificates/create',
  '/api/certificates/update',
  '/api/certificates/delete'
];

// Function to check if route is protected
const isProtectedRoute = (path: string): boolean => {
  return protectedRoutes.some(route => path.startsWith(route));
};

// Function to check if route is admin-only
const isAdminRoute = (path: string): boolean => {
  return adminRoutes.some(route => path.startsWith(route));
};

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const method = req.method;
  
  // Allow public GET requests to blog endpoints
  if (path.startsWith('/api/blogs') && method === 'GET') {
    // Allow GET requests to /api/blogs and /api/blogs/slug/* for public access
    if (path === '/api/blogs' || path.startsWith('/api/blogs/slug/')) {
      return NextResponse.next();
    }
    // For GET /api/blogs/[id], allow public access (route handler will check permissions)
    if (path.match(/^\/api\/blogs\/[^/]+$/) && method === 'GET') {
      return NextResponse.next();
    }
  }
  
  // Skip authentication for non-protected routes
  if (!isProtectedRoute(path)) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  const token = req.cookies.get('auth_token')?.value;
  
  // If no token is found, redirect to login
  if (!token) {
    // For API routes, return 401 Unauthorized
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For admin pages, redirect to login
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }
  
  try {
    // Verify token
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'abcefghijklmnopqrstuvwxyz1234567890'
    );
    
    console.log('Verifying token for path:', path);
    
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256']
    });
    
    console.log('Token payload:', payload);
    console.log('Is admin route:', isAdminRoute(path));
    console.log('User role:', payload.role);
    
    // Check if admin route and user is not admin
    if (isAdminRoute(path) && payload.role !== 'admin') {
      console.log('Access denied - Admin role required');
      // For API routes, return 403 Forbidden
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Admin privileges required' },
          { status: 403 }
        );
      }
      
      // For admin pages, redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    // User is authenticated and authorized, proceed
    return NextResponse.next();
  } catch (error) {
    console.error('Token validation error:', error);
    
    // Token is invalid or expired
    // For API routes, return 401 Unauthorized
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // For admin pages, redirect to login with expired session message
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    loginUrl.searchParams.set('error', 'Session expired');
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match admin routes
    '/admin/:path*'
  ],
}; 