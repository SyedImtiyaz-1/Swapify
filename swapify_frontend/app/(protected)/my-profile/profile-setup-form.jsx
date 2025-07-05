'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProfileSetupForm({ initialData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const initialPreviewImage = initialData.user_avatar? `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${initialData.user_avatar}` : initialData.google_user_avatar.replace('=s96-c', '') || '/assets/place-holder.jpg'
  const [previewImage, setPreviewImage] = useState(initialPreviewImage)
  const [imageName, setImageName] = useState(initialData.user_avatar || '')
  const [formData, setFormData] = useState({
    username: initialData.username || '',
    phone_number: initialData.phone_number || '',
    country: initialData.country || 'India',
    state: initialData.state || '',
    city: initialData.city || '',
    pincode: initialData.pincode || '',
    user_avatar: initialData.user_avatar || ''
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)
    const loadingToast = toast.loading('Uploading image...')

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('files', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const filename = data.files[0].filename
      const imageUrl = `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${filename}`
      setImageName(filename)
      setPreviewImage(imageUrl)
      setFormData(prev => ({
        ...prev,
        user_avatar: filename
      }))
      toast.success('Image uploaded successfully!', { id: loadingToast })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.', { id: loadingToast })
    } finally {
      setImageLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const loadingToast = toast.loading('Updating profile...')

    try {
      // Get token from cookie (client-side)
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch('/api/profile-setup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Profile updated successfully!', { id: loadingToast })
        
      } else {
        toast.error(data.error || 'Failed to update profile', { id: loadingToast })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Delete the token cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Redirect to logout API route
    router.push('/auth/login')
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="mx-auto bg-white rounded-lg shadow-md mb-4 items-center dark:bg-gray-700">
            <div className="w-[250px] p-4 rounded-lg items-center mx-auto text-center cursor-pointer">
              <label htmlFor="upload" className="cursor-pointer">
                <img
                  src={previewImage}
                  alt="Profile preview"
                  width={250}
                  height={250}
                  className="mb-4 rounded-full object-cover object-center w-full aspect-square mx-auto"
                />

                <h5 className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer">
                  Upload Profile Photo
                </h5>
              </label>
              <input
                id="upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 mb-4 p-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 bg-gray-100 rounded-lg dark:bg-gray-800">
            {/* Name Field */}
            <div className="sm:col-span-2">
              <label htmlFor="username" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Full Name
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Ex. Gyana Ranjan"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="sm:col-span-2">
              <label htmlFor="phone-number" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="phone">
                    <path fill="currentColor" d="M12.2 10c-1.1-.1-1.7 1.4-2.5 1.8C8.4 12.5 6 10 6 10S3.5 7.6 4.1 6.3c.5-.8 2-1.4 1.9-2.5-.1-1-2.3-4.6-3.4-3.6C.2 2.4 0 3.3 0 5.1c-.1 3.1 3.9 7 3.9 7 .4.4 3.9 4 7 3.9 1.8 0 2.7-.2 4.9-2.6 1-1.1-2.5-3.3-3.6-3.4z"></path>
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone-number"
                  name="phone_number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="9876543210"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid gap-4 mb-4 grid-cols-2 sm:gap-6 sm:mb-5 p-4 w-full bg-gray-100 rounded-lg dark:bg-gray-800">
            <div className="w-full">
              <label htmlFor="country" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="India"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="state" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="odisha"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="city" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Cuttack"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="pincode" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Pincode
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                placeholder="753001"
                required
              />
            </div>
          </div>

          {/* Submit and Logout Buttons */}
          <div className="flex justify-center items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-3/4 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            
            <button
              type="button"
              onClick={handleLogout}
              className="w-1/4 text-red-600 inline-flex items-center justify-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 sm:px-5 py-2.5 text-center whitespace-nowrap"
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </section>
  )
} 