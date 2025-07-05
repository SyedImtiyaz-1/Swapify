import { NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/verifyToken'

export const POST = async (req) => {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { isLoggedIn: false, user: null },
      { status: 401 }
    )
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const decoded = await verifyToken(token)
    const googleimage= decoded.user.google_user_avatar.replace('=s96-c', '')
    
    
    return NextResponse.json({
      isLoggedIn: true,
      user_avatar: decoded.user.user_avatar,
      google_user_avatar: googleimage
    })
  } catch {
    return NextResponse.json(
      { error: "invalid token" },
      { isLoggedIn: false, user: null },
      { status: 401 }
    )
  }
}