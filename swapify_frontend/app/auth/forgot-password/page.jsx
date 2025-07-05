'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Sending reset link...');

    try {
      const response = await axios.post("/api/forgot-password", { email });
      toast.success('Password reset link sent to your email!', { id: loadingToast });
      setIsSubmitted(true);
      setCooldown(30);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          toast.error('Network error. Please check your connection.', { id: loadingToast });
        } else {
          toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.', { id: loadingToast });
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.', { id: loadingToast });
      }
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md lg:max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="flex flex-col items-center space-y-6">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/assets/Swapify.jpg"
                  alt="Swapify Logo"
                  width={120}
                  height={120}
                  className="w-24 h-24 rounded-lg"
                />
              </Link>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Forgot Password
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Enter your email to receive a password reset link
              </p>
            </div>

            <div className="mt-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                      aria-describedby="email-help"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="mb-4">
                    <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox and spam folder.
                  </p>
                  <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
                    The link will expire in 1 hour.
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={cooldown > 0 || isLoading}
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : cooldown > 0 ? (
                      `Resend in ${cooldown}s`
                    ) : (
                      'Resend Email'
                    )}
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}