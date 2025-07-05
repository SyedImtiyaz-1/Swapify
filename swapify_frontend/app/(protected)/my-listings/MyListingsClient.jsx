"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ListingsContainer from './ListingsContainer';

const MyListingsClient = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/my-listings`, {
          headers: {
            'Cookie': `token=${token}`
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <section
        className="flex items-center justify-center h-screen bg-white dark:bg-gray-900"
        aria-live="polite"
      >
        <p className="text-base text-gray-900 dark:text-white">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="flex items-center justify-center h-screen bg-white dark:bg-gray-900"
        aria-live="assertive"
      >
        <p className="text-base text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 pb-20 md:pb-4">
      <h1 className="text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white my-4">
        My Listings
      </h1>
      <ListingsContainer initialListings={listings} />
    </section>
  );
};

export default MyListingsClient; 