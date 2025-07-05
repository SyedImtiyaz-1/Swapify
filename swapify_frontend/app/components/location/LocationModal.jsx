"use client";
import { useState, useEffect } from 'react';
import { BiSearch, BiX, BiCurrentLocation } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { createPortal } from 'react-dom';

const popularCities = [
  {
    "display_name": "Mumbai, Maharashtra, India",
    "lat": "19.0760",
    "lon": "72.8777"
  },
  {
    "display_name": "Bangalore, Karnataka, India",
    "lat": "12.9716",
    "lon": "77.5946"
  },
  {
    "display_name": "Delhi, India",
    "lat": "28.7041",
    "lon": "77.1025"
  },
  {
    "display_name": "Chennai, Tamil Nadu, India",
    "lat": "13.0827",
    "lon": "80.2707"
  },
  {
    "display_name": "Hyderabad, Telangana, India",
    "lat": "17.3850",
    "lon": "78.4867"
  },
  {
    "display_name": "Pune, Maharashtra, India",
    "lat": "18.5204",
    "lon": "73.8567"
  },
  {
    "display_name": "Kolkata, West Bengal, India",
    "lat": "22.5726",
    "lon": "88.3639"
  },
  {
    "display_name": "Ahmedabad, Gujarat, India",
    "lat": "23.0225",
    "lon": "72.5714"
  },
  {
    "display_name": "Jaipur, Rajasthan, India",
    "lat": "26.9124",
    "lon": "75.7873"
  },
  {
    "display_name": "Chandigarh, India",
    "lat": "30.7333",
    "lon": "76.7794"
  }
];

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // State for selected location
  const [selectedLocation, setSelectedLocation] = useState({
    display_name: Cookies.get('display_name') || '',
    lat: Cookies.get('latitude') || '',
    lon: Cookies.get('longitude') || ''
  });

  // Function to fetch locations from Nominatim API
  const fetchLocations = async (query) => {
    if (query.length < 3) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}, India&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        fetchLocations(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    const selectedData = {
      display_name: location.display_name,
      lat: location.lat,
      lon: location.lon
    };
    
    setSelectedLocation(selectedData);
    
    // Set cookies
    Cookies.set('display_name', location.display_name, { expires: 30 });
    Cookies.set('latitude', location.lat, { expires: 30 });
    Cookies.set('longitude', location.lon, { expires: 30 });
    
    onSelect(location.display_name);
    setSearchQuery('');
    setSuggestions([]);
    
    // Reload the page after selecting a location
    window.location.reload();
  };

  // Add auto-detect location function
  const detectLocation = async () => {
    setIsDetecting(true);
    setError(null);

    try {
      // Request location permission
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // Fetch location details from Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (!response.ok) throw new Error('Failed to fetch location details');

      const data = await response.json();
      
      // Create location object
      const detectedLocation = {
        display_name: data.display_name,
        lat: latitude.toString(),
        lon: longitude.toString()
      };

      handleLocationSelect(detectedLocation);
    } catch (err) {
      console.error('Location detection error:', err);
      if (err.code === 1) {
        setError('Location permission denied. Please enable location access.');
      } else if (err.code === 2) {
        setError('Location unavailable. Please try again.');
      } else {
        setError('Failed to detect location. Please try again.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[99999] overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-gray-900 dark:border dark:border-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Select Location
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Search and Auto-detect section */}
              <div className="space-y-4 max-w-2xl mx-auto">
                {/* Search input */}
                <div className="relative">
                  <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search for a location..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Auto-detect button */}
                <button
                  onClick={detectLocation}
                  disabled={isDetecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-base font-medium text-gray-700 transition-colors duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BiCurrentLocation className={`h-5 w-5 ${isDetecting ? 'animate-spin' : ''}`} />
                  {isDetecting ? 'Detecting location...' : 'Auto-detect my location'}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl max-w-2xl mx-auto">
                  {error}
                </div>
              )}

              {/* Selected Location */}
              {selectedLocation.display_name && (
                <div className="my-6 max-w-2xl mx-auto">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Selected Location</h4>
                  <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 dark:bg-red-900/30 dark:border-red-800/30 dark:text-red-300">
                    <IoLocationSharp className="flex-shrink-0 text-red-600 dark:text-red-400 text-lg" />
                    <span className="text-base dark:text-red-100 truncate">
                      {selectedLocation.display_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Popular Cities */}
              {!searchQuery && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300">Trending Marketplace Cities</h4>
                    <span className="px-2.5 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
                      11 cities
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {popularCities.map((city) => (
                      <button
                        key={city.display_name}
                        onClick={() => handleLocationSelect(city)}
                        className="group p-5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <IoLocationSharp className="text-red-500 flex-shrink-0" size={18} />
                          <div className="text-gray-800 dark:text-white font-medium text-base truncate">
                            {city.display_name.split(',')[0]}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {city.display_name.split(',').slice(1).join(',')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="mt-4 max-h-[300px] overflow-y-auto">
                {isLoading && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                )}
                {suggestions.map((location) => (
                  <button
                    key={location.place_id}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-colors dark:hover:bg-gray-800"
                  >
                    <IoLocationSharp className="flex-shrink-0 text-gray-400 dark:text-gray-500 text-lg" />
                    <div className="text-base font-medium dark:text-gray-200">{location.display_name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LocationModal;