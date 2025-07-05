import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    
    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Verify token with backend
        const verifyResponse = await fetch(`${process.env.BACKEND}/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await verifyResponse.json();

        // If verification failed
        if (!verifyResponse.ok || !data.isLoggedIn) {
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            response.cookies.delete('token');
            return response;
        }

        // Token is valid, proceed with the request
        const response = NextResponse.next();
        if (data.user?._id) {
            response.headers.set('x-user-id', data.user._id);
        }
        
        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        // Only redirect on actual errors, not verification failures
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/my-profile',
        '/my-profile/:path*',
        '/create-listing',
        '/create-listing/:path*',
        '/edit/:path*',
        '/my-listings',
        '/my-listings/:path*'
    ]
}