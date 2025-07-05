"use client";
import { useEffect, useState } from 'react';

const LocationPermission = ({ onGranted }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const checkPermissions = async () => {
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'denied') {
                setErrorMessage('Location access is still blocked. Please enable it in your browser settings.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking permissions:', error);
            setErrorMessage('Unable to check location permissions.');
            return false;
        }
    };

    const getLocation = async () => {
        if (!navigator.geolocation) {
            setShowPopup(true);
            setErrorMessage('Geolocation is not supported by your browser.');
            onGranted(28.6139, 77.2090); // Default to New Delhi coordinates
            return;
        }

        const hasPermission = await checkPermissions();
        if (!hasPermission) {
            setShowPopup(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onGranted(latitude, longitude);
                setShowPopup(false);
            },
            (error) => {
                setShowPopup(true);
                let message = 'Error getting location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location access is blocked. Please enable it in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message = 'The request to get location timed out.';
                        break;
                    default:
                        message = 'An unknown error occurred.';
                }
                setErrorMessage(message);
                onGranted(28.6139, 77.2090); // Default to New Delhi coordinates
            }
        );
    };

    useEffect(() => {
        getLocation();
    }, [onGranted]);

    const handleRetry = async () => {
        setShowPopup(false);
        setErrorMessage('');
        await getLocation();
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Location Access Required</h2>
                <p className="mb-4">
                    To create accurate listings, we need access to your location. Please enable 
                    location services in your browser settings.
                </p>
                {errorMessage && (
                    <div className="mb-4 text-red-600 text-sm">
                        {errorMessage}
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={handleRetry}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPermission; 