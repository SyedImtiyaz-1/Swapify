'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import FilterContainer from './FilterContainer';
import SearchListingCard from './SearchListingCard';
import MobileFilter from './MobileFilter';

// Helper function to format price in Indian currency
const formatIndianPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper function for formatting distance
const formatDistance = (distance) => {
  if (!distance) return '';
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m away`;
  }
  return `${distance.toFixed(1)}km away`;
};

const SearchSkeleton = () => (
  <div className="animate-pulse flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="bg-gray-200 dark:bg-gray-700 w-full aspect-[4/3]"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const SearchListingContainer = ({ initialQuery }) => {
  const [searchResults, setSearchResults] = useState({ listings: [], total: 0, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: initialQuery || '',
    range: '50',
    location: { latitude: null, longitude: null }
  });

  // Get user location on component mount
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setSearchParams(prev => ({
              ...prev,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }));
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    getLocation();
  }, []);

  const handleSearch = async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const { query, range, location } = params;
      
      // Always include maxDistance parameter with a numeric value
      const url = `/api/search?query=${encodeURIComponent(query)}` +
        `&maxDistance=${range}` +  // range will always be a number now
        (location.latitude ? `&latitude=${location.latitude}&longitude=${location.longitude}` : '');
      
      console.log('Searching with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch search results');
      }

      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
      setSearchResults({ listings: [], total: 0, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.query) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(searchParams);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults({ listings: [], total: 0, message: '' });
    }
  }, [searchParams]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results
          {searchResults.total > 0 && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({searchResults.total} found)
            </span>
          )}
        </h1>
        
        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FilterContainer 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>

        {/* Mobile Filters */}
        <MobileFilter
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {isLoading ? (
          <>
            <SearchSkeleton />
            <SearchSkeleton />
            <SearchSkeleton />
            <SearchSkeleton />
          </>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-red-500 dark:text-red-400 mb-4">
              {error}
            </div>
            <Link 
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Return to homepage
            </Link>
          </div>
        ) : searchResults.listings.length > 0 ? (
          searchResults.listings.map((listing) => (
            <SearchListingCard 
              key={listing._id} 
              listing={{
                id: listing._id,
                title: listing.title,
                location: listing.location_display_name || `${listing.city}, ${listing.state}`,
                price: formatIndianPrice(listing.price),
                description: listing.description || '',
                imageUrl: `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${listing.cover_image}`,
                distance: listing.distance ? formatDistance(listing.distance) : null
              }} 
            />
          ))
        ) : searchParams.query ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              No results found for &quot;{searchParams.query}&quot;
            </div>
            <Link 
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Return to homepage
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchListingContainer; 