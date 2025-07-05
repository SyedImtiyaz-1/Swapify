"use client";
import { useState, useEffect } from 'react';
import { IoLocationSharp, IoChevronDownOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

// Dynamically import the modal with no SSR to avoid hydration issues
const LocationModal = dynamic(() => import('./LocationModal'), {
  ssr: false
});

const LocationSelector = ({ isMobile = false }) => {
  // Initialize with empty values to match server-side render
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    display_name: '',
    lat: '',
    lon: ''
  });
  
  // Modified useEffect to check for location and open modal if needed
  useEffect(() => {
    const displayName = Cookies.get('display_name') || '';
    const latitude = Cookies.get('latitude') || '';
    const longitude = Cookies.get('longitude') || '';
    
    setSelectedLocation({
      display_name: displayName,
      lat: latitude,
      lon: longitude
    });

    // Open modal if latitude or longitude is not available
    if (!latitude || !longitude) {
      setIsModalOpen(true);
    }
  }, []);

  const handleLocationSelect = (displayName) => {
    setSelectedLocation(prev => ({
      ...prev,
      display_name: displayName
    }));
    setIsModalOpen(false);
  };

  // Enhanced format display text function for desktop
  const formatDisplayText = (displayName) => {
    if (!displayName) return 'Select your location';
    
    const parts = displayName.split(',').map(part => part.trim());
    
    // For shorter locations, show first two parts
    if (parts.length <= 2) {
      return parts.join(', ');
    }
    
    // Get city and state/region
    const city = parts[0];
    const state = parts.slice(1, 3).find(part => 
      part.length > 2 && part.length < 20
    ) || parts[1];

    // Return shortened version with ellipsis
    const formattedText = `${city}, ${state}`;
    return formattedText.length > 25 ? formattedText.substring(0, 23) + '...' : formattedText;
  };

  // Enhanced mobile format function
  const formatMobileDisplayText = (displayName) => {
    if (!displayName) return 'Set location';
    
    const parts = displayName.split(',').map(part => part.trim());
    
    // For mobile, show only city or first part
    const city = parts[0];
    return city.length > 15 ? city.substring(0, 13) + '...' : city;
  };

  // Compute display text once to ensure consistency
  const displayText = formatDisplayText(selectedLocation.display_name);
  const hasLocation = Boolean(selectedLocation.display_name);

  if (isMobile) {
    return (
      <div className="relative w-full">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute left-0 z-10 flex items-center h-full min-w-[120px] max-w-[140px]
              hover:bg-gray-50 active:bg-gray-100 rounded-l-xl transition-colors
              dark:hover:bg-gray-800 dark:active:bg-gray-700"
          >
            <div className="flex items-center px-3">
              <div className="relative flex-shrink-0">
                <IoLocationSharp 
                  className={`h-4 w-4 transition-colors ${
                    hasLocation ? 'text-purple-500 dark:text-purple-400' : 'text-gray-400'
                  }`}
                />
                {hasLocation && (
                  <span className="absolute -top-1 -right-1 h-1.5 w-1.5 bg-green-500 rounded-full">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 ml-1.5">
                {/* Contained text overflow with tooltip */}
                <span 
                  className="max-w-[70px] truncate text-xs font-medium text-gray-700 dark:text-gray-300"
                  title={selectedLocation.display_name}
                >
                  {formatMobileDisplayText(selectedLocation.display_name)}
                </span>
                <IoChevronDownOutline 
                  className={`h-3 w-3 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    isModalOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
            </div>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
          </button>

          {/* Search Input with Adjusted Padding */}
          <div className="relative flex-1">
            <input 
              type="search" 
              name="q" 
              className="w-full pl-[145px] pr-12 h-11 text-sm text-gray-900 
                border border-gray-200 rounded-xl bg-gray-50/50 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                placeholder:text-gray-400 transition-all
                dark:bg-gray-800/50 dark:border-gray-700 dark:text-white
                dark:placeholder:text-gray-500"
              placeholder="Enter search..."
            />
            
            {/* Search Button */}
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors
                dark:hover:bg-gray-700 dark:active:bg-gray-600"
              aria-label="Search"
            >
              <svg 
                className="w-5 h-5 text-gray-500 dark:text-gray-400" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 20 20"
              >
                <path 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        <LocationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleLocationSelect}
        />
      </div>
    );
  }

  // Desktop Version
  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="group w-full flex items-center gap-2 px-3.5 py-2.5 
          bg-white hover:bg-gray-50 active:bg-gray-100
          border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
          transition-all duration-200 
          dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        aria-label="Select location"
        title={selectedLocation.display_name}
      >
        <div className="relative flex-shrink-0">
          <IoLocationSharp 
            className={`h-5 w-5 transition-colors ${
              hasLocation 
                ? 'text-purple-500 dark:text-purple-400' 
                : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'
            }`} 
          />
          {hasLocation && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            </span>
          )}
        </div>

        <span 
          className={`text-sm truncate max-w-[200px] ${
            hasLocation
              ? 'font-medium text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {formatDisplayText(selectedLocation.display_name)}
        </span>

        <IoChevronDownOutline 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0
            group-hover:text-gray-500 dark:text-gray-500 ${
            isModalOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLocationSelect}
        className="desktop"
      />
    </div>
  );
};

export default LocationSelector; 