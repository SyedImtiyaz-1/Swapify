'use client';

import Image from 'next/image';
import ChatWithSeller from './ChatWithSeller';
import MakeOffer from './MakeOffer';
import MessageBox from './MessageBox';

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function ListingActions({ listing }) {
  const seller = listing.seller_id;

  // Get avatar - use Google avatar if available, else create initials avatar
  const hasGoogleAvatar = seller?.google_user_avatar;
  const initials = seller?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'US';

  return (
    <>
      {/* Seller Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          About the Seller
        </h2>
        <div className="flex items-center gap-4 mb-6">
          {hasGoogleAvatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
              <Image
                src={seller.google_user_avatar.replace('=s96-c', '=s400-c')}
                alt={seller.full_name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {seller.full_name}
              {seller.is_verified && (
                <span className="inline-flex items-center ml-2">
                  <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </h3>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {formatDate(seller.created_at)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contact available after chat
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <ChatWithSeller phoneNumber={listing.seller_no} listing={listing} />
          <MakeOffer listing={listing} />
        </div>
      </div>

      {/* Message Box */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <MessageBox listing={listing} />
      </div>
    </>
  );
} 