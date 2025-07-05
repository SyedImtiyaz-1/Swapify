import { notFound } from 'next/navigation'
import Header from '@/app/components/header/Header'
import MobileNavigation from '@/app/components/MobileNavigation'
import ListingCard from '@/app/components/ListingCard'

async function getProfile(username) {
  try {
    const res = await fetch(`${process.env.BACKEND}/u/${username}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function UserProfile({ params }) {
  const profile = await getProfile(params.username)
  
  if (!profile) {
    notFound()
  }

  const { user, listings } = profile

  return (
    <>
      <Header />
      <MobileNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section - Mobile First */}
        <div className="block lg:hidden mb-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Mobile Profile Header/Banner */}
            <div className="relative h-32 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <img
                  src={user.user_avatar ? `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${user.user_avatar}` : '/assets/place-holder.jpg'}
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
            </div>
            
            {/* Mobile Profile Info */}
            <div className="pt-20 px-6 pb-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              
              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-gray-100">
                  <p className="text-2xl font-bold text-gray-900 text-center">{listings.length}</p>
                  <p className="text-gray-600 text-center text-sm">Listings</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-gray-100">
                  <p className="text-2xl font-bold text-gray-900 text-center">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-gray-600 text-center text-sm">Joined</p>
                </div>
              </div>
              
              {/* Location Info */}
              {(user.city || user.state) && (
                <div className="mt-6 flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                  <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">
                    {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {/* Contact Button */}
              <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity">
                Contact Seller
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Desktop Profile Section - Left Side */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
              {/* Profile Header/Banner */}
              <div className="relative h-32 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 lg:left-8 lg:transform-none">
                  <img
                    src={user.user_avatar ? `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${user.user_avatar}` : '/assets/place-holder.jpg'}
                    alt={user.full_name}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="pt-20 px-8 pb-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                </div>
                
                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-gray-100">
                    <p className="text-2xl font-bold text-gray-900 text-center">{listings.length}</p>
                    <p className="text-gray-600 text-center text-sm">Listings</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 transition-all hover:bg-gray-100">
                    <p className="text-2xl font-bold text-gray-900 text-center">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-gray-600 text-center text-sm">Joined</p>
                  </div>
                </div>
                
                {/* Location Info */}
                {(user.city || user.state) && (
                  <div className="mt-6 flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">
                      {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Contact Button */}
                <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-opacity">
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* Listings Section - Right Side */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {listings.length > 0 ? 'Active Listings' : 'No Active Listings'}
              </h2>
              
              {listings.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {listings.map((listing) => (
                    <ListingCard 
                      key={listing._id} 
                      listing={listing}
                      className="col-span-1" // keeps each card in its column
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">This user hasn't posted any listings yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 