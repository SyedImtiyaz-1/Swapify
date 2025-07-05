"use client"
import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import DeleteModal from './DeleteModal';

const ListingsContainer = ({ initialListings }) => {
    const [listings, setListings] = useState(initialListings);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleShowModal = (event) => {
            setSelectedListingId(event.detail);
        };

        const handleDeleteSuccess = () => {
            setListings(prevListings => 
                prevListings.filter(listing => listing._id !== selectedListingId)
            );
            setSelectedListingId(null);
        };

        window.addEventListener('showDeleteModal', handleShowModal);
        window.addEventListener('listingDeleted', handleDeleteSuccess);
        
        return () => {
            window.removeEventListener('showDeleteModal', handleShowModal);
            window.removeEventListener('listingDeleted', handleDeleteSuccess);
        };
    }, [selectedListingId]);

    return (
        <section className="mx-auto max-w-screen-lg justify-center bg-white p-4 dark:bg-gray-900">
            {error && (
                <div className="text-red-500 text-center">{error}</div>
            )}
            
            {!listings.length && (
                <div className="text-center">No listings found</div>
            )}
            
            {listings.map((listing) => (
                <ListingCard 
                    key={listing._id} 
                    listing={listing}
                />
            ))}

            <DeleteModal 
                listingId={selectedListingId} 
                onDeleteSuccess={() => {
                    window.dispatchEvent(new Event('listingDeleted'));
                }}
            />
        </section>
    );
};

export default ListingsContainer; 