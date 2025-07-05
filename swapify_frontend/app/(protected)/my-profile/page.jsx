import { headers, cookies } from 'next/headers'
import Header from '@/app/components/header/Header'
import MobileNavigation from '@/app/components/MobileNavigation'
import ProfileSetupForm from './profile-setup-form'

export default async function ProfileSetup() {
  // Get the current user ID and token from the request headers/cookies
  const userId = await headers().get('x-user-id')
  console.log(userId)

  // Set default profile data
  let profileData = {
    username: '',
    phone_number: '',
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    user_avatar: ''
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/user/${userId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

    const data = await response.json()

    profileData = {
      username: data.username || '',
      phone_number: data.phone_number || '',
      country: data.country || 'India',
      state: data.state || '',
      city: data.city || '',
      pincode: data.pincode || '',
      user_avatar: data.user_avatar || '',
      google_user_avatar: data.google_user_avatar || '',
      
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
    // Optionally handle errors (e.g. redirect or show a fallback UI)
  }

  return (
    <>
      <Header />
      <MobileNavigation />
      <div className="pb-20 md:pb-4">
        <ProfileSetupForm initialData={profileData} />
      </div>
    </>
  )
}
