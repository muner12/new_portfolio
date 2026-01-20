"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const error = searchParams.get('error');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Auth stages: login -> verification (if 2FA) -> success
  const [authStage, setAuthStage] = useState<'login' | 'verification' | 'success'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Set error message from URL param
  useEffect(() => {
    if (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }, [error]);
  
  // Get human-readable error message
  const getErrorMessage = (errorKey: string) => {
    const errorMessages: { [key: string]: string } = {
      adminAccessRequired: 'You need admin access to view this page.',
      invalidCredentials: 'Invalid email or password.',
      sessionExpired: 'Your session has expired. Please log in again.',
      default: 'An error occurred. Please try again.'
    };
    
    return errorMessages[errorKey] || errorMessages.default;
  };
  
  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      
      if (data.requiresVerification) {
        // 2FA is enabled, move to verification stage
        setAuthStage('verification');
        setSuccessMessage('Verification code sent to your email');
      } else {
        // No 2FA, login successful
        setAuthStage('success');
        setSuccessMessage('Login successful! Redirecting...');
        
        // Redirect after a brief delay
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1500);
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle verification code submission
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, verificationCode })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }
      
      setAuthStage('success');
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect after a brief delay
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1500);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {authStage === 'login' && 'Sign in to your admin account'}
            {authStage === 'verification' && 'Enter verification code sent to your email'}
            {authStage === 'success' && 'Login successful!'}
          </p>
        </div>
        
        {/* Alert messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          {/* Login form */}
          {authStage === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          )}
          
          {/* Verification form */}
          {authStage === 'verification' && (
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter 6-digit code"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit code sent to your email address
                </p>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthStage('login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  disabled={isLoading}
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
          
          {/* Success message */}
          {authStage === 'success' && (
            <div className="text-center py-4">
              <svg 
                className="w-16 h-16 text-green-500 mx-auto mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-300">
                You will be redirected to the dashboard shortly...
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <Link 
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Return to website
          </Link>
        </div>
      </div>
    </div>
  );
} 