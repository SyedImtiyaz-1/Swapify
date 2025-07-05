"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getToken } from '@/app/utils/getToken';
import { IoLocationSharp, IoImageOutline, IoTrashOutline } from 'react-icons/io5';
import dynamic from 'next/dynamic';

// Dynamically import LocationModal
const LocationModal = dynamic(() => import('../../create-listing/ListingLocationModal'), {
  ssr: false
});

// Add constants
const MAX_ADDITIONAL_IMAGES = 9;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const EditListingForm = ({ listingId }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageName, setCoverImageName] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageNames, setAdditionalImageNames] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    display_name: '',
    lat: '',
    lon: ''
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/listings/${listingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch listing');
        const data = await response.json();

        // Update form fields
        setTitle(data.title);
        setPrice(data.price);
        setCategory(data.category);
        setSubcategory(data.subcategory);
        setDescription(data.description);
        setPhoneNumber(data.seller_no);
        setCoverImageName(data.cover_image);
        setAdditionalImageNames(data.additional_images || []);
        
        // Set location data
        setSelectedLocation({
          display_name: data.location_display_name,
          lat: data.location.coordinates[1],
          lon: data.location.coordinates[0]
        });

        // Set images with CDN URLs
        if (data.cover_image) {
          setCoverImage(`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${data.cover_image}`);
        }
        
        if (data.additional_images?.length) {
          setAdditionalImages(
            data.additional_images.map(img => 
              `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${img}`
            )
          );
        }
      } catch (error) {
        toast.error('Failed to load listing details');
      }
    };

    fetchListing();
  }, [listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          price,
          description,
          phoneNumber,
          coverImageName,
          additionalImageNames,
          category,
          subcategory,
          location: selectedLocation
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to update listing');
      
      toast.success('Listing updated successfully!');
      router.push('/my-listings');
    } catch (error) {
      toast.error(error.message || 'Failed to update listing');
    } finally {
      setIsUpdating(false);
    }
  };

  // Add image handling functions
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Please upload JPG, PNG or WebP images only');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
      setCoverImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + additionalImages.length > MAX_ADDITIONAL_IMAGES) {
      toast.error(`You can only upload up to ${MAX_ADDITIONAL_IMAGES} additional images`);
      return;
    }

    const invalidFile = files.find(file => 
      !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      toast.error('All images must be JPG, PNG or WebP and less than 5MB');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImages(prev => [...prev, reader.result]);
        setAdditionalImageNames(prev => [...prev, file.name]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImageNames(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:grid lg:grid-cols-[65fr_45fr] lg:gap-8">
        {/* Images Section - Will appear first on mobile */}
        <div className="order-1 lg:order-2 space-y-6 bg-white rounded-xl shadow-lg p-6 mb-6 lg:mb-0">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {coverImage ? (
                <div className="relative">
                  <img 
                    src={coverImage} 
                    alt="Cover preview" 
                    className="h-48 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage('');
                      setCoverImageName('');
                    }}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <IoTrashOutline className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <IoImageOutline className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a cover image</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Images ({additionalImages.length}/{MAX_ADDITIONAL_IMAGES})
            </label>
            <div className="mt-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5">
              {additionalImages.map((image, index) => (
                <div key={index} className="relative aspect-square w-16 sm:w-20">
                  <img 
                    src={image} 
                    alt={`Additional ${index + 1}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                  >
                    <IoTrashOutline className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {additionalImages.length < MAX_ADDITIONAL_IMAGES && (
                <label className="cursor-pointer aspect-square w-16 sm:w-20 flex items-center justify-center border border-gray-300 border-dashed rounded-md hover:border-indigo-500">
                  <div className="space-y-0.5 text-center">
                    <IoImageOutline className="mx-auto h-5 w-5 text-gray-400" />
                    <div className="text-[10px] text-gray-600">Add</div>
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Details Section - Will appear second on mobile */}
        <div className="order-2 lg:order-1 space-y-6 bg-white rounded-xl shadow-lg p-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product title"
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border rounded-lg text-left focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <div className="relative w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <IoLocationSharp className={`h-5 w-5 ${selectedLocation.display_name ? 'text-indigo-600' : 'text-indigo-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${selectedLocation.display_name ? 'text-gray-900' : 'text-gray-500'}`}>
                  {selectedLocation.display_name || 'Select Location'}
                </p>
              </div>
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your product"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your WhatsApp number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
          >
            {isUpdating ? 'Updating...' : 'Update Listing'}
          </button>
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={(location) => {
          setSelectedLocation(location);
          setIsLocationModalOpen(false);
        }}
        selectedLocation={selectedLocation}
      />
    </form>
  );
};

export default EditListingForm;
