"use client";
import { useState } from 'react';

export default function ListingDescription({ description }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="w-full flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4">
      <p className={`${!showDescription && 'line-clamp-6'}`}>
        {description}
      </p>
      {description.split(' ').length > 20 && (
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="text-start font-bold underline cursor-pointer"
        >
          {showDescription ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
} 