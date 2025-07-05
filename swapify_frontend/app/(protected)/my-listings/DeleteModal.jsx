"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const DeleteModal = ({listingId, onDeleteSuccess}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleShowModal = (event) => {
            if (listingId) {
                setIsVisible(true);
            }
        };

        window.addEventListener('showDeleteModal', handleShowModal);
        return () => window.removeEventListener('showDeleteModal', handleShowModal);
    }, [listingId]);

    const handleDelete = async () => {
        if (isDeleting || !listingId) return;
        
        setIsDeleting(true);
        const loadingToast = toast.loading('Deleting listing...');
        
        try {
            const response = await fetch(`/api/listings/delete/${listingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete listing');
            }

            toast.success('Listing deleted successfully!', { id: loadingToast });
            setIsVisible(false);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
            router.refresh();
        } catch (error) {
            console.error('Error deleting listing:', error);
            toast.error(error.message || 'Failed to delete listing', { id: loadingToast });
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex bg-black bg-opacity-50">
            <div className="relative max-h-full w-full max-w-md p-4">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                    <div className="p-4 text-center md:p-5">
                        <svg className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this listing?
                        </h3>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : "Yes, I'm sure"}
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            disabled={isDeleting}
                            className="ms-3 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal; 