import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { message: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Updated to call the correct endpoint - directly on the root path
    const response = await axios.post(
      `${process.env.BACKEND}/verify-reset-token`,
      { email, token },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Verify token error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { message: error.response?.data?.message || 'Token verification failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}