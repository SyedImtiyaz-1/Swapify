import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const latitude = searchParams.get('latitude');
        const longitude = searchParams.get('longitude');
        const maxDistance = searchParams.get('maxDistance') || 50000;
        const category = searchParams.get('category');

        if (!latitude || !longitude) {
            return NextResponse.json({ 
                listings: [],
                message: 'Location coordinates are required'
            }, { status: 400 });
        }

        // Construct the backend URL with all parameters
        let url = `${process.env.BACKEND}/nearby-listings?` +
            `latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`;

        // Add category if provided
        if (category && category !== 'all') {
            url += `&category=${category}`;
        }

        console.log('Fetching from backend:', url); // Debug log

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        console.log('Backend response:', {
            listingsCount: data.listings?.length,
            message: data.message
        }); // Debug log

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in nearby-listings API:', error);
        return NextResponse.json({ 
            listings: [],
            message: 'Failed to fetch nearby listings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
} 