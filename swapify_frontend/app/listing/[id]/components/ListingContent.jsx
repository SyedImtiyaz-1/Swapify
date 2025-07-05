'use client';

import dynamic from 'next/dynamic';

const ImageGallery = dynamic(() => import('./ImageGallery'), { ssr: false });
const ListingActions = dynamic(() => import('./ListingActions'));
const ListingDescription = dynamic(() => import('./ListingDescription'));
const SafetyTips = dynamic(() => import('./SafetyTips'));
const RelatedListings = dynamic(() => import('./RelatedListings'));

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function ListingContent({ listing, relatedListings }) {
  // Combine cover image with additional images
  const allImages = [listing.cover_image, ...(listing.additional_images || [])];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="text-sm">
          <ol className="list-none p-0 flex text-gray-500 dark:text-gray-400">
            <li className="flex items-center">
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300">{listing.category}</span>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            {listing.subcategory && (
              <li className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300">{listing.subcategory}</span>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </li>
            )}
            <li className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
              {listing.title}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images Only */}
          <div>
            {/* Image Gallery */}
            <ImageGallery images={allImages} title={listing.title} />
          </div>

          {/* Right Column - Details, Description & Actions */}
          <div className="space-y-6">
            {/* Main Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {listing.title}
                </h1>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{listing.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Inclusive of all taxes
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Pickup Location</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {listing.location_display_name}
                    </p>
                  </div>
                </div>

                {/* Category & Subcategory */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                    {listing.category}
                  </span>
                  {listing.subcategory && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {listing.subcategory}
                    </span>
                  )}
                </div>

                {/* Posted Date */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {formatDate(listing.created_at)}
                </div>

                {/* Seller Quick Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Listed by</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {listing.seller_id.full_name}
                    {listing.seller_id.is_verified && (
                      <span className="inline-flex items-center ml-1">
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                About this item
              </h2>
              <ListingDescription description={listing.description} />
            </div>

            {/* Listing Actions (Chat, Offer, Message) */}
            <ListingActions listing={listing} />

            {/* Safety Tips */}
            <SafetyTips />
          </div>
        </div>

        {/* Related Listings Section */}
        {relatedListings.length > 0 && (
          <RelatedListings listings={relatedListings} />
        )}
      </div>
    </main>
  );
}