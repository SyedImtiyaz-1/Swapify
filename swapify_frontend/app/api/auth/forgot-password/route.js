import { NextResponse } from 'next/server';
import axios from 'axios';

// Define the handler for POST requests
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Make direct request to the backend
    console.log('Sending forgot password request to backend:', `${process.env.BACKEND}/forgot-password`);
    
    const response = await axios.post(
      `${process.env.BACKEND}/forgot-password`,
      { email },
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
    console.error('Forgot password error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { message: error.response?.data?.message || 'Reset link request failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}