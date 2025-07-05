'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Helper function to format distance
const formatDistance = (distance) => {
  if (!distance) return null;
  if (distance === 0) {
    return "On Spot";
  }
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  return `${Math.round(distance * 10) / 10}km away`;
};

// Helper function to format price
const formatPrice = (price) => {
  if (!price) return '₹0';
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function ListingCard({ listing }) {
  const [imageError, setImageError] = useState(false)
  
  const imageUrl = listing.cover_image 
    ? `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${listing.cover_image}`
    : '/assets/listing-placeholder.jpg'

  return (
    <Link 
      href={`/listing/${listing._id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
    >
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
        {/* Image Container */}
        <div className="relative aspect-video">
          <Image
            src={imageError ? '/assets/listing-placeholder.jpg' : imageUrl}
            alt={`Image of ${listing.title}`}
            onError={() => setImageError(true)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              {formatPrice(listing.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 dark:text-white">
            {listing.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-gray-300">
            {listing.description}
          </p>

          {/* Location */}
          {listing.location_display_name && (
            <div className="flex items-center text-gray-500 text-sm dark:text-gray-400 mb-1" aria-label="Location">
              <svg 
                className="w-4 h-4 mr-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="truncate">
                {listing.location_display_name}
              </span>
            </div>
          )}

          {/* Distance */}
          {listing.distance && (
            <div className="flex items-center text-blue-600 text-sm dark:text-blue-400 mb-2" aria-label="Distance">
              <svg 
                className="w-4 h-4 mr-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span>{formatDistance(listing.distance)}</span>
            </div>
          )}

          {/* Date */}
          <time 
            className="block mt-2 text-xs text-gray-500 dark:text-gray-400"
            dateTime={new Date(listing.created_at).toISOString()}
          >
            Listed on {new Date(listing.created_at).toLocaleDateString()}
          </time>
        </div>
      </article>
    </Link>
  )
} 