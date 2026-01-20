import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface AuthUserData {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// Get authenticated user from the request
export async function getAuthUser(request?: NextRequest): Promise<AuthUserData | null> {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = request 
      ? request.cookies.get('auth_token')?.value 
      : cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || 'abcefghijklmnopqrstuvwxyz1234567890'
    );
    
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256']
    });
    
    console.log('Auth payload:', payload);
    
    // Ensure all required fields are present and of correct type
    if (!payload.id || !payload.email || !payload.role) {
      console.error('Invalid token payload:', payload);
      return null;
    }
    
    return {
      id: String(payload.id), // Ensure id is a string
      email: String(payload.email),
      role: String(payload.role),
      name: payload.name ? String(payload.name) : undefined
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Check if the user is authenticated
export async function isAuthenticated(request?: NextRequest): Promise<boolean> {
  const user = await getAuthUser(request);
  return user !== null;
}

// Check if the user is an admin
export async function isAdmin(request?: NextRequest): Promise<boolean> {
  const user = await getAuthUser(request);
  return user !== null && user.role === 'admin';
}

// Utility for API route handlers to get the authenticated user
export async function getAuthUserFromRequest(request: NextRequest): Promise<AuthUserData | null> {
  return getAuthUser(request);
}

// Authentication error responses
export class AuthError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export function createAuthErrorResponse(message: string, statusCode: number = 401) {
  return Response.json(
    { error: message },
    { status: statusCode }
  );
}

// Middleware for route handlers
export async function requireAuth(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  
  if (!user) {
    throw new AuthError('Authentication required');
  }
  
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  
  if (!user) {
    throw new AuthError('Authentication required');
  }
  
  if (user.role !== 'admin') {
    throw new AuthError('Admin privileges required', 403);
  }
  
  return user;
} 