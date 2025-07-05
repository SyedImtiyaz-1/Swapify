'use client';
import { useCallback } from 'react';

const FilterContainer = ({ searchParams, setSearchParams }) => {
  const handleInputChange = useCallback((field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  }, [setSearchParams]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        value={searchParams.query}
        onChange={(e) => handleInputChange('query', e.target.value)}
        placeholder="Search for items..."
        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <select
        value={searchParams.range}
        onChange={(e) => handleInputChange('range', e.target.value)}
        className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="1">Nearby</option>
        <option value="5">Within 5km</option>
        <option value="10">Within 10km</option>
        <option value="25">Within 25km</option>
        <option value="50">Within 50km</option>
        <option value="100">Within 100km</option>
        <option value="500">Within State</option>
      </select>
    </div>
  );
};

export default FilterContainer; 