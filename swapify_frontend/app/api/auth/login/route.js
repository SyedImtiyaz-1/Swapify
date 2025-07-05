import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axios.post(
      `${process.env.BACKEND}/login`,
        {
        email: email,
        user_password: password
        },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Login error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please try again later.' },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { message: error.response?.data?.message || 'Login failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
