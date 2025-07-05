import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Await params before destructuring
    const { id } = await params; // Awaiting params as per instructions

    if (!id) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Fetch listing from backend
    const response = await fetch(`${process.env.BACKEND}/listings/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch listing');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) { // Added error parameter
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Awaiting params as per instructions
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(`${process.env.BACKEND}/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update listing' },
      { status: 500 }
    );
  }
}
