import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a random 6-digit code
function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email with 2FA code
async function sendTwoFactorEmail(email: string, code: string, name: string) {
  // Create a test account if no email configuration is provided
  // For production, configure proper email credentials in env variables
  const emailUser = 'ubunerstudent@gmail.com';
  const emailPass = 'tshj vzsk qyoa tprc';
  
  let transporter;
  
  if (emailUser && emailPass) {
    transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  } else {
    // For development - use Ethereal Email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const mailOptions = {
    from:'ubunerstudent@gmail.com',
    to: email,
    subject: 'Your Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Login Verification</h2>
        <p>Hello ${name},</p>
        <p>Your verification code for login is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  
  // For development - log the test email URL
  if (!emailUser || !emailPass) {
    console.log('Email verification URL: %s', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

// Store 2FA codes (in production, use Redis or another appropriate solution)
const twoFactorCodes: Record<string, { code: string; expires: Date }> = {};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, verificationCode } = await req.json();
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If verification code is provided, validate it
    if (verificationCode) {
      const storedData = twoFactorCodes[email];
      
      if (!storedData || storedData.code !== verificationCode) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 401 }
        );
      }
      
      if (new Date() > storedData.expires) {
        delete twoFactorCodes[email];
        return NextResponse.json(
          { error: 'Verification code expired' },
          { status: 401 }
        );
      }
      
      // Clear the used code
      delete twoFactorCodes[email];
      
      // Create JWT token
      console.log('Creating token for user:', {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      });
      
      const secretKey = new TextEncoder().encode(
        process.env.JWT_SECRET || 'abcefghijklmnopqrstuvwxyz1234567890'
      );
      
      const token = await new SignJWT({ 
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secretKey);
      
      console.log('Generated token:', token);
      
      // Set cookie with JWT token
      const response = NextResponse.json(
        { 
          message: 'Login successful',
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          } 
        },
        { status: 200 }
      );
      
      // Set HttpOnly cookie to prevent XSS
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });
      
      // Add debug logging
      console.log('Setting auth token cookie for user:', {
        id: user._id,
        email: user.email,
        role: user.role
      });
      
      return response;
    }
    
    // First step: Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // If user has 2FA enabled, send verification code
    if (user.twoFactorEnabled) {
      const twoFactorCode = generateTwoFactorCode();
      
      // Store code with expiration time (10 minutes)
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10);
      
      twoFactorCodes[email] = {
        code: twoFactorCode,
        expires: expirationTime
      };
      
      // Send verification email
      await sendTwoFactorEmail(user.email, twoFactorCode, user.name);
      
      return NextResponse.json(
        { 
          message: 'Verification code sent to your email',
          requiresVerification: true
        },
        { status: 200 }
      );
    }
    
    // If 2FA is not enabled (not recommended for admin)
    const token = await new SignJWT({ 
      id: user._id.toString(),
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'abcefghijklmnopqrstuvwxyz1234567890'));
    
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        } 
      },
      { status: 200 }
    );
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
} 