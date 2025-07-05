import Image from 'next/image';
import Link from 'next/link';

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

const SearchListingCard = ({ listing }) => {
  return (
    <Link 
      href={`/listing/${listing.id}`}
      className="group flex flex-row md:flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-transparent"
    >
      <div className="relative w-32 md:w-full aspect-square md:aspect-[4/3] flex-shrink-0">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 8rem, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="flex-1 p-3 md:p-4 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {listing.price}
        </h2>
        
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize line-clamp-1 mt-1">
          {listing.title}
        </p>
        
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c3.865 0 7 3.134 7 7 0 3.337-3 8-7 13-4-5-7-9.663-7-13 0-3.866 3.135-7 7-7zM12 6a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <p className="truncate">{listing.location}</p>
          </div>
          
          {listing.distance && (
            <div className="flex items-center text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>{formatDistance(listing.distance)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchListingCard; 