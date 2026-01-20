import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, adminSecret } = await req.json();
    
    // Validate admin secret to ensure only authorized people can register as admin
    const validAdminSecret = process.env.ADMIN_SECRET || 'abcefghijklmnopqrstuvwxyz1234567890';
    if (adminSecret !== validAdminSecret) {
      return NextResponse.json(
        { error: 'Invalid admin secret. Unauthorized registration attempt.' },
        { status: 401 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', // Only admins can register through this endpoint
      twoFactorEnabled: true // Enable 2FA by default for admins
    });

    // Don't return password in response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled
    };

    return NextResponse.json(
      { message: 'Admin registered successfully', user: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register admin user' },
      { status: 500 }
    );
  }
} 