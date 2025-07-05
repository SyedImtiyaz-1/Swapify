"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import SkeletonLoader from './SkeletonLoader';
import categories from '../data/categories.json';

// Helper function to format price in Indian currency
const formatIndianPrice = (price) => {
    if (price === 0) {
        return "Free";
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
};

// Helper function to format distance
const formatDistance = (distance) => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m away`;
    }
    return `${Math.round(distance * 10) / 10}km away`;
};

// Distance options in kilometers
const DISTANCE_OPTIONS = [
    { label: 'Within 5km', value: 5000 },
    { label: '10km', value: 10000 },
    { label: '25km', value: 25000 },
    { label: '50km', value: 50000 },
    { label: '100km', value: 100000 },
    { label: '250km', value: 250000 },
    { label: '500km', value: 500000 },
    { label: '1000km', value: 1000000 }
];

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDistance, setSelectedDistance] = useState(1000000);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchListings = async (maxDistance, category) => {
        try {
            setLoading(true);
            const latitude = Cookies.get('latitude');
            const longitude = Cookies.get('longitude');

            let url = `${process.env.NEXT_PUBLIC_HOST}/api/listings`;
            let params = {};

            if (latitude && longitude && !isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
                url = `${process.env.NEXT_PUBLIC_HOST}/api/listings/nearby`;
                params = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    maxDistance
                };

                // Add category to params if selected
                if (category) {
                    params.category = category;
                }

                console.log('Request URL:', url);
                console.log('Request Params:', params);

                const response = await axios.get(url, { params });
                console.log('Response:', response.data);
                
                // Update listings state with the response data
                const responseData = response.data;
                setListings(responseData.listings || []);
                
                // Show message if provided
                if (responseData.message) {
                    setError(responseData.listings?.length === 0 ? responseData.message : null);
                }
            } else {
                // If no location, fetch all listings
                if (category) {
                    params.category = category;
                }
                const response = await axios.get(url, { params });
                setListings(response.data.listings || []);
            }
        } catch (err) {
            console.error("Error details:", err);
            setError(err.response?.data?.message || "Failed to load listings");
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle distance filter change
    const handleDistanceChange = async (distance) => {
        setSelectedDistance(distance);
        await fetchListings(distance, selectedCategory);
    };

    // Handle category filter change
    const handleCategoryChange = async (categoryId) => {
        console.log('Category changed to:', categoryId);
        const newCategory = categoryId === selectedCategory ? null : categoryId;
        setSelectedCategory(newCategory);
        await fetchListings(selectedDistance, newCategory);
    };

    useEffect(() => {
        fetchListings(selectedDistance, selectedCategory);
    }, []); // Only fetch on mount

    return (
        <div className=" min-h-screen pb-8">
            {/* Filters Container */}
            <div className="max-w-screen-xl mx-auto px-4 pt-6 space-y-4">
                {/* Category Filter */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r  dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3 pb-2 min-w-min">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`
                                        px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
                                        whitespace-nowrap flex items-center gap-2.5
                                        ${selectedCategory === category.id
                                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 backdrop-blur-sm'
                                        }
                                    `}
                                >
                                    <span className="text-lg">{category.icon}</span>
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Distance Filter */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-3 pb-2 min-w-min">
                            {DISTANCE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleDistanceChange(option.value)}
                                    className={`
                                        px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 
                                        whitespace-nowrap
                                        ${selectedDistance === option.value
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 backdrop-blur-sm'
                                        }
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Listings Grid Container */}
            <div className="max-w-screen-xl mx-auto px-4 mt-8">
                {loading ? (
                    <SkeletonLoader />
                ) : error && listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-gray-400 text-center">
                            {error}
                        </p>
                    </div>
                ) : listings.length > 0 && (
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {listings.map((item) => (
                            <div 
                                key={item._id} 
                                className={`group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${
                                    item.isNearby === false ? 'border-yellow-200 dark:border-yellow-700' : ''
                                }`}
                            >
                                <Link href={`/listing/${item._id}`} aria-label={`View details of ${item.title}`} tabIndex="0">
                                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                                        <Image 
                                            src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${item.cover_image}`} 
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            alt={item.title || "Listing image"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                </Link>
                                <div className="p-2 sm:p-4">
                                    <Link href={`/listing/${item._id}`} aria-label={`View details of ${item.title}`} tabIndex="0">
                                        <h5 className={`text-base sm:text-xl font-semibold mb-1 sm:mb-2 ${
                                            item.price === 0 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-gray-900 dark:text-white'
                                        }`}>
                                            {formatIndianPrice(item.price)}
                                        </h5>
                                    </Link>
                                    <Link href={`/listing/${item._id}`} aria-label={`View details of ${item.title}`} tabIndex="0">
                                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-1 sm:mb-2 line-clamp-2">
                                            {item.title}
                                        </p>
                                    </Link>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 capitalize">
                                        {item.category}
                                    </p>
                                    <div className="flex flex-col gap-1 mb-2 sm:mb-4">
                                        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c3.865 0 7 3.134 7 7 0 3.337-3 8-7 13-4-5-7-9.663-7-13 0-3.866 3.135-7 7-7zM12 6a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            <p className="truncate">{item.location_display_name}</p>
                                        </div>
                                        {item.distance && (
                                            <div className="flex items-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                                <span>{formatDistance(item.distance)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link 
                                        href={`/listing/${item._id}`} 
                                        className="inline-flex items-center w-full justify-center px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md sm:rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700 transition-colors duration-200"
                                        aria-label={`View details of ${item.title}`}
                                        tabIndex="0"
                                    >
                                        View Details
                                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 ms-1 sm:ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </Link>
                                    {item.isNearby === false && (
                                        <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs">
                                            Recent Listing
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

// Add this CSS to your global styles or a CSS module
const styles = `
    .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;     /* Firefox */
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;             /* Chrome, Safari and Opera */
    }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default Listings; 