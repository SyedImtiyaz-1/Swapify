import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const ListingCard = ({ listing }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Format price to Indian format
    const formatIndianPrice = (price) => {
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });
        return formatter.format(price);
    };

    const imageUrl = listing.cover_image 
        ? `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${listing.cover_image}`
        : '/assets/listing-placeholder.jpg';

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('showDeleteModal', { detail: listing._id }));
        setShowMenu(false);
    };

    return (
        <div className="group relative flex flex-row lg:flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800 mb-6 lg:w-[280px]">
            <Link href={`/listing/${listing._id}`} className="relative shrink-0">
                <div className="h-[120px] w-[120px] lg:h-[200px] lg:w-full">
                    <Image 
                        src={imageError ? '/assets/listing-placeholder.jpg' : imageUrl}
                        alt={`Image of ${listing.title}`}
                        fill
                        sizes="(max-width: 1024px) 120px, 280px"
                        onError={() => setImageError(true)}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>
            <div className="flex flex-col justify-between p-3 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <Link href={`/listing/${listing._id}`}>
                            <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 transition-colors duration-200 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                                {formatIndianPrice(listing.price)}
                            </h5>
                        </Link>
                        <p className="mb-2 text-sm font-medium line-clamp-1 text-gray-700 dark:text-gray-300">
                            {listing.title}
                        </p>
                        <div className="mb-2 flex items-center text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c3.865 0 7 3.134 7 7 0 3.337-3 8-7 13-4-5-7-9.663-7-13 0-3.866 3.135-7 7-7zM12 6a2 2 0 100 4 2 2 0 000-4z" />
                            </svg>
                            <p className="line-clamp-1 text-xs">
                                {listing.location_display_name.length > 30 ? listing.location_display_name.substring(0, 30) + '...' : listing.location_display_name}
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700"
                        >
                            <BsThreeDotsVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-gray-700">
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                                >
                                    Delete Listing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-end gap-2 lg:mt-4">
                    <Link href={`/edit/${listing._id}`}>
                        <button 
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-1.5 text-center text-xs font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 active:scale-95"
                            aria-label="Edit listing"
                        >
                            Edit
                        </button>
                    </Link>
                    <Link href={`/listing/${listing._id}`}>
                        <button 
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-1.5 text-center text-xs font-medium text-white transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 active:scale-95"
                            aria-label="View listing details"
                        >
                            View
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;