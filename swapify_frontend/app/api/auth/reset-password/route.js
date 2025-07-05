import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { message: 'Email, token, and new password are required' },
        { status: 400 }
      );
    }

    // Log the request for debugging
    console.log('Sending reset password request to backend:', `${process.env.BACKEND}/reset-password`);
    
    const response = await axios.post(
      `${process.env.BACKEND}/reset-password`,
      { email, token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Backend response:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { message: error.response?.data?.message || 'Password reset failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}