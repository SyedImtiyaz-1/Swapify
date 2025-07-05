'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function RelatedListings({ listings }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Similar Listings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((item) => (
          <Link
            key={item._id}
            href={`/listing/${item._id}`}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${item.cover_image}`}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{item.location_display_name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 