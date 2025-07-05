'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getToken } from '@/app/utils/getToken';
import categories from '@/app/data/categories.json';
import dynamic from 'next/dynamic';
import { IoLocationSharp } from 'react-icons/io5';

// Dynamically import LocationModal
const ListingLocationModal = dynamic(() => import('./ListingLocationModal'), {
  ssr: false
});

const STEPS = [
  {
    id: 'category',
    title: 'Category',
    description: 'Select a category',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-4M14 3h6m0 0v6m0-6L10 14" />
      </svg>
    )
  },
  {
    id: 'images',
    title: 'Images',
    description: 'Add product photos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'details',
    title: 'Details',
    description: 'Add product information',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'contact',
    title: 'Finish',
    description: 'Complete your listing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    )
  }
];

const DRAFT_KEY = 'listing_draft';

const CreateListingForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [coverImageName, setCoverImageName] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageNames, setAdditionalImageNames] = useState([]);
  const MAX_ADDITIONAL_IMAGES = 9;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    display_name: '',
    lat: '',
    lon: ''
  });

  // Load draft on initial render
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || '');
        setPrice(draft.price || '');
        setDescription(draft.description || '');
        setPhoneNumber(draft.phoneNumber || '');
        
        // Update cover image handling
        if (draft.coverImageName) {
          setCoverImageName(draft.coverImageName);
          setCoverImage(`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${draft.coverImageName}`);
        }
        
        // Update additional images handling
        if (draft.additionalImageNames && draft.additionalImageNames.length > 0) {
          setAdditionalImageNames(draft.additionalImageNames);
          setAdditionalImages(
            draft.additionalImageNames.map(
              name => `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${name}`
            )
          );
        }
        
        setSelectedCategory(draft.category || '');
        setSelectedSubcategory(draft.subcategory || '');
        setSelectedLocation(draft.location || { display_name: '', lat: '', lon: '' });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Save draft whenever form data changes
  useEffect(() => {
    const draft = {
        title,
        price,
        description,
        phoneNumber,
        coverImageName,
        additionalImageNames,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        location: {
            display_name: selectedLocation.display_name,
            lat: selectedLocation.lat,
            lon: selectedLocation.lon
        }
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [title, price, description, phoneNumber, coverImageName, additionalImageNames, selectedCategory, selectedSubcategory, selectedLocation]);

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  // Add these premium gradient styles
  const premiumGradients = {
    light: {
      primary: 'from-indigo-600 to-purple-600',
      secondary: 'from-indigo-50 to-purple-50',
      accent: 'from-indigo-500/10 to-purple-500/10',
    },
    dark: {
      primary: 'from-indigo-500 to-purple-500',
      secondary: 'from-indigo-900/50 to-purple-900/50',
      accent: 'from-indigo-800/30 to-purple-800/30',
    }
  };

  const gradientBorderStyle = {
    background: `linear-gradient(var(--bg-color), var(--bg-color)) padding-box,
                linear-gradient(to right, #6366F1, #9333EA) border-box`,
    border: '2px solid transparent',
    '--bg-color': 'var(--background)',
  };

  const handleCoverImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('files', file);

        // Show loading toast
        const loadingToast = toast.loading('Uploading cover image...', {
            style: {
                background: '#18181b',
                color: '#fff',
            },
            iconTheme: {
                primary: '#6366f1',
                secondary: '#fff',
            },
        });

        try {
            setIsLoading(true);

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB', { id: loadingToast });
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file', { id: loadingToast });
                return;
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload cover image');
            }

            const data = await response.json();
            const filename = data.files[0].filename;
            setCoverImageName(filename);
            setCoverImage(`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${filename}`);
            
            // Show success toast
            toast.success('Cover image uploaded successfully!', {
                id: loadingToast,
                style: {
                    background: '#18181b',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                },
                duration: 3000,
            });
        } catch (error) {
            console.error('Error uploading cover image:', error);
            // Show error toast
            toast.error('Failed to upload image. Please try again.', {
                id: loadingToast,
                style: {
                    background: '#18181b',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleAdditionalImages = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > MAX_ADDITIONAL_IMAGES) {
      toast.error(`You can only upload up to ${MAX_ADDITIONAL_IMAGES} additional images`);
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Uploading images...');

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('files', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return {
          filename: data.files[0].filename,
          url: `${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${data.files[0].filename}`
        };
      });

      const results = await Promise.all(uploadPromises);
      
      setAdditionalImageNames(prev => [...prev, ...results.map(r => r.filename)]);
      setAdditionalImages(prev => [...prev, ...results.map(r => r.url)]);
      
      toast.success('Images uploaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images. Please try again.', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
        title,
        price,
        description,
        phoneNumber,
        coverImageName,
        additionalImageNames,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        location: {
            display_name: selectedLocation.display_name,
            lat: selectedLocation.lat || null,  // Use null if not available
            lon: selectedLocation.lon || null  // Use null if not available
        }
    };

    try {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/create-listing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to create listing');
        }

        // Handle success
        toast.success('Listing created successfully!');
        clearDraft(); // Clear the draft after successful submission
        router.push('/my-listings'); // Redirect to listings page
    } catch (error) {
        console.error('Error creating listing:', error);
        toast.error('Failed to create listing');
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImageNames(prev => prev.filter((_, i) => i !== index));
  };

  // Function to check if step is complete
  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Category only
        return selectedCategory !== '' && selectedSubcategory !== '';
      case 1: // Images
        return coverImage !== '';
      case 2: // Details
        return title !== '' && 
               price !== '' && 
               description !== '' && 
               selectedLocation.display_name !== '' &&
               selectedLocation.lat !== '' &&
               selectedLocation.lon !== '';
      case 3: // Contact & Listing Type
        return phoneNumber !== '';
      default:
        return false;
    }
  };

  // Function to handle step navigation
  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1 && isStepComplete(currentStep)) {
      // Set category when moving from category step
      if (currentStep === 0) {
        setCategory(selectedCategory);
      }
      
      // Show success toast when completing a step
      const stepName = STEPS[currentStep].title.toLowerCase();
      toast.success(`${stepName} saved successfully!`, {
        icon: '✓',
        duration: 2000
      });
      
      // Animate and move to next step
      setCurrentStep(prev => prev + 1);
    } else if (!isStepComplete(currentStep)) {
      switch (currentStep) {
        case 0:
          if (!selectedCategory || !selectedSubcategory) {
            toast.error('Please select both category and subcategory');
          }
          break;
        case 1:
          toast.error('Please upload at least a cover image');
          break;
        case 2:
          if (!title) toast.error('Please enter a title');
          else if (!price) toast.error('Please enter a price');
          else if (!description) toast.error('Please enter a description');
          else if (!selectedLocation.display_name || !selectedLocation.lat || !selectedLocation.lon) {
            toast.error('Please select a valid location with coordinates');
          }
          break;
        case 3:
          toast.error('Please enter your WhatsApp number');
          break;
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Add category selection handlers
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  // Add a progress calculation function
  const calculateProgress = () => {
    let completedSteps = 0;
    STEPS.forEach((_, index) => {
      if (isStepComplete(index)) completedSteps++;
    });
    return (completedSteps / STEPS.length) * 100;
  };

  const handleLocationSelect = (locationData) => {
    // Ensure we have all required location data
    if (locationData.display_name && locationData.lat && locationData.lon) {
      setSelectedLocation({
        display_name: locationData.display_name,
        lat: locationData.lat,
        lon: locationData.lon
      });
      setIsLocationModalOpen(false);
    } else {
      toast.error('Invalid location data. Please try another location.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">

      {/* Premium Steps Indicator */}
      <div className="mb-8 overflow-x-hidden">
        <div className="relative">
          {/* Connection Lines - Updated for dark mode */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-700" />
          <div 
            className={`absolute top-5 left-0 h-[2px] bg-gradient-to-r ${premiumGradients.light.primary} dark:${premiumGradients.dark.primary} transition-all duration-500`}
            style={{ width: `${calculateProgress()}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = isStepComplete(index);
              const isCurrent = index === currentStep;
              const isClickable = isCompleted || index === currentStep;

              return (
                <div key={step.id} className="flex-1">
                  <button
                    onClick={() => isClickable && setCurrentStep(index)}
                    disabled={!isClickable}
                    className={`
                      relative group flex flex-col items-center w-full
                      ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    `}
                  >
                    {/* Context Line */}
                    {isCurrent && (
                      <div className="absolute top-5 left-1/2 w-screen h-[2px] -translate-x-1/2 -z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100 dark:via-indigo-900/30 to-transparent" />
                      </div>
                    )}

                    {/* Step Circle */}
                    <div className={`
                      relative w-8 md:w-10 h-8 md:h-10 rounded-full 
                      flex items-center justify-center
                      transition-all duration-300 
                      ${isCompleted 
                        ? `bg-gradient-to-r ${premiumGradients.light.primary} dark:${premiumGradients.dark.primary} shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30` 
                        : isCurrent
                          ? 'bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-400'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                      }
                      ${isClickable && !isCompleted ? 'group-hover:scale-105' : ''}
                    `}>
                      {/* Step Icon/Number */}
                      {isCompleted ? (
                        <svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className={`relative z-20 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {step.icon}
                        </div>
                      )}

                      {/* Current Step Indicator */}
                      {isCurrent && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 blur-sm opacity-40" />
                          <div className="absolute -inset-1 rounded-full border-2 border-indigo-200 dark:border-indigo-800" />
                          <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 z-20">
                            <div className="absolute inset-0 rounded-full bg-indigo-600 dark:bg-indigo-400 opacity-25 animate-pulse" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Step Label */}
                    <div className={`
                      relative z-20 mt-2 text-center transition-all duration-300
                      ${isCurrent ? 'transform -translate-y-1' : ''}
                    `}>
                      <div className={`
                        text-xs md:text-sm font-medium mb-1
                        ${isCurrent 
                          ? 'text-indigo-600 dark:text-indigo-400 transform scale-105' 
                          : isCompleted 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {step.title}
                      </div>
                      <p className={`
                        text-[10px] md:text-xs transition-all duration-300
                        ${isCurrent 
                          ? 'text-gray-600 dark:text-gray-300 opacity-100' 
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 opacity-75'
                        }
                      `}>
                        {step.description}
                      </p>
                    </div>

                    {/* Hover Tooltip */}
                    {isCompleted && index !== currentStep && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <div className="bg-gray-900 dark:bg-gray-800 text-white text-[10px] md:text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                          Click to edit
                        </div>
                        <div className="w-2 h-2 bg-gray-900 dark:bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900/95 rounded-xl shadow-lg overflow-hidden transition-all duration-300
        border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <div className="p-4 md:p-8">
          {/* Step Title */}
          <div className="mb-6 animate-fadeIn">
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {STEPS[currentStep].description}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Category Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                {!selectedCategory ? (
                  // Main Categories Grid with Premium Design
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        type="button"
                        className="group relative overflow-hidden p-6 rounded-xl text-center 
                          bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50
                          border border-gray-200 dark:border-gray-700 hover:border-transparent
                          transition-all duration-300 ease-out
                          hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.2)]"
                      >
                        {/* Background Decoration */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full -mr-12 -mt-12" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-indigo-100/40 rounded-full -ml-12 -mb-12" />
                        </div>

                        <div className="relative flex flex-col items-center space-y-4">
                          {/* Icon Container */}
                          <div className="relative">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 
                              flex items-center justify-center transform transition-transform duration-300 
                              group-hover:scale-110 group-hover:rotate-3"
                            >
                              <span className="text-3xl md:text-4xl transform transition-transform duration-300 group-hover:-rotate-3">
                                {category.icon}
                              </span>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Category Name */}
                          <div className="relative">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {category.name}
                            </h3>
                            
                            {/* Subtle Line Decoration */}
                            <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-indigo-300 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          </div>
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 
                          flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                        >
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Select</span>
                          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Subcategories View with Back Button
                  <div>
                    {/* Header with Back Button */}
                    <div className="flex items-center space-x-4 mb-8">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('');
                          setSelectedSubcategory('');
                        }}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
                      >
                        <svg 
                          className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 19l-7-7 7-7" 
                          />
                        </svg>
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {categories.find(cat => cat.id === selectedCategory)?.icon}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {categories.find(cat => cat.id === selectedCategory)?.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Select a subcategory that best describes your item
                        </p>
                      </div>
                    </div>

                    {/* Subcategories Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categories
                        .find(cat => cat.id === selectedCategory)
                        ?.subcategories.map((subcat) => (
                          <button
                            key={subcat}
                            type="button"
                            onClick={() => handleSubcategorySelect(subcat)}
                            className={`group relative overflow-hidden p-4 rounded-xl text-left transition-all duration-300 
                              ${selectedSubcategory === subcat
                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                                : 'bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-md'
                              }`}
                          >
                            {/* Background Decoration */}
                            <div className={`absolute inset-0 transition-opacity duration-300
                              ${selectedSubcategory === subcat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full -mr-10 -mt-10" />
                              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-black/5 to-black/10 rounded-full -ml-10 -mb-10" />
                            </div>

                            {/* Content */}
                            <div className="relative">
                              <span className={`text-sm font-medium block mb-1 transition-colors duration-200
                                ${selectedSubcategory === subcat 
                                  ? 'text-white' 
                                  : 'text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                }`}
                              >
                                {subcat}
                              </span>

                              {/* Selection Indicator */}
                              <div className={`flex items-center gap-2 transition-all duration-300
                                ${selectedSubcategory === subcat
                                  ? 'opacity-100 translate-y-0'
                                  : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                                }`}
                              >
                                <span className={`text-xs font-medium
                                  ${selectedSubcategory === subcat
                                    ? 'text-indigo-100'
                                    : 'text-indigo-600 dark:text-indigo-400'
                                  }`}
                                >
                                  {selectedSubcategory === subcat ? 'Selected' : 'Select'}
                                </span>
                                <svg 
                                  className={`w-4 h-4 ${
                                    selectedSubcategory === subcat ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'
                                  }`} 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  {selectedSubcategory === subcat ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  )}
                                </svg>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Images */}
            {currentStep === 1 && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Cover Image */}
                  <div className="mb-6 lg:mb-0">
                    <div className="flex flex-col mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Cover Image
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          This will be the main image shown in search results
                        </p>
                      </div>
                    </div>
                    <div className="relative group">
                      <label 
                        htmlFor="upload" 
                        className={`cursor-pointer block relative ${coverImage ? 'group' : ''}`}
                        style={!coverImage ? gradientBorderStyle : {}}
                      >
                        {coverImage ? (
                          <>
                            <img 
                              src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${coverImageName}`} 
                              className="rounded-xl w-full object-center object-cover aspect-[16/9] shadow-sm" 
                              alt="Cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
                              <span className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                                <svg className="w-4 h-4 inline mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Change Cover Image
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 transition-all duration-300">
                            <div className="aspect-[16/9] flex flex-col items-center justify-center p-8">
                              {/* Premium Upload Icon */}
                              <div className="relative mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 flex items-center justify-center transform -rotate-6 transition-transform group-hover:rotate-0">
                                  <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="absolute -right-3 -bottom-3 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                  </svg>
                                </div>
                              </div>

                              {/* Text Content */}
                              <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Cover Image</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Drag and drop your image here, or click to browse
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  Maximum file size: 5MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </label>
                      <input 
                        id="upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                      />
                    </div>
                  </div>

                  {/* Right Column - Additional Images */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">Additional Images</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Add more angles and details
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600/10 to-purple-600/10 text-indigo-600">
                        {additionalImages.length}/{MAX_ADDITIONAL_IMAGES}
                      </span>
                    </div>
                    
                    {/* Additional Images Grid - 3x3 Layout */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Existing Images */}
                      {additionalImages.map((img, index) => (
                        <div key={index} className="relative aspect-square group rounded-lg overflow-hidden shadow-sm">
                          <img 
                            src={img} 
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <span className="absolute bottom-1 left-1 text-white text-[10px] font-medium px-1.5 py-0.5 bg-black/50 rounded-md">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Placeholder Slots */}
                      {[...Array(MAX_ADDITIONAL_IMAGES - additionalImages.length)].map((_, index) => (
                        <label 
                          key={`placeholder-${index}`}
                          htmlFor="additional-images" 
                          className={`cursor-pointer aspect-square rounded-lg 
                            bg-gradient-to-br from-gray-50/80 to-gray-100/80 
                            border-2 border-dotted border-gray-300 
                            hover:border-indigo-300 hover:from-indigo-50 hover:to-purple-50 
                            hover:shadow-sm
                            transition-all duration-200 
                            flex flex-col items-center justify-center group 
                            ${index === 0 && additionalImages.length < MAX_ADDITIONAL_IMAGES ? 'animate-pulse' : ''}
                            relative overflow-hidden
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-indigo-50/5 before:to-purple-50/5
                          `}
                        >
                          <div className="text-center p-2 relative z-10">
                            <div className="w-6 h-6 mx-auto rounded-full bg-white shadow-sm 
                              flex items-center justify-center mb-1 
                              group-hover:scale-110 group-hover:shadow-md 
                              transition-all duration-200"
                            >
                              <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">
                              {additionalImages.length + index + 1}
                            </span>
                          </div>
                          {/* Decorative Corner */}
                          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 transform rotate-12" />
                        </label>
                      ))}

                      {/* Hidden Input */}
                      <input 
                        id="additional-images" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImages}
                        disabled={additionalImages.length >= MAX_ADDITIONAL_IMAGES}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Selected Category Display */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl mt-1">
                        {categories.find(cat => cat.id === selectedCategory)?.icon}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {categories.find(cat => cat.id === selectedCategory)?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedSubcategory}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Change</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg 
                          border border-gray-300 dark:border-gray-700 
                          bg-white dark:bg-gray-900
                          text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                          placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter a clear, descriptive title"
                      />
                    </div>

                    {/* Price Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">₹</span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-lg 
                            border border-gray-300 dark:border-gray-700 
                            bg-white dark:bg-gray-900
                            text-gray-900 dark:text-gray-100
                            focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Location Selector with Enhanced UI */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="w-full flex items-center gap-3 p-3 
                          bg-white dark:bg-gray-900 
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          active:bg-gray-100 dark:active:bg-gray-700
                          border border-gray-300 dark:border-gray-700 rounded-lg text-left
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                          transition-all duration-200 group"
                      >
                        <div className="relative flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                          <IoLocationSharp 
                            className={`h-5 w-5 ${
                              selectedLocation.display_name 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-indigo-400 dark:text-indigo-600'
                            }`}
                          />
                          {selectedLocation.display_name && (
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-green-500 rounded-full">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-medium ${
                              selectedLocation.display_name
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {selectedLocation.display_name ? 'Selected Location' : 'Select Location'}
                            </p>
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          {selectedLocation.display_name && (
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              {selectedLocation.display_name}
                            </p>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 rounded-lg 
                        border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        resize-none
                        placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Describe your product in detail..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Listing Type */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      WhatsApp Number
                    </label>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                      This number will be used by buyers to contact you about your listing
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 rounded-lg 
                        border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-900
                        text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                        text-sm 
                        placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Enter your WhatsApp number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                    />
                  </div>

                  {/* Instructions Card */}
                  <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <h4 className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      Important Information
                    </h4>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                        <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                        </svg>
                        <span>Enter a valid 10-digit mobile number linked with WhatsApp</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                        <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                        </svg>
                        <span>Buyers will contact you directly through WhatsApp</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] text-indigo-600 dark:text-indigo-300">
                        <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                        </svg>
                        <span>Make sure to respond promptly to buyer inquiries</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Listing Type Selection */}
                <div className="mt-8">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Listing Type
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Free Listing Option */}
                    <div className="relative">
                      <input 
                        type="radio" 
                        name="listing-type" 
                        id="free-listing"
                        className="peer hidden" 
                        checked 
                        readOnly
                      />
                      <label 
                        htmlFor="free-listing"
                        className="block p-4 bg-white dark:bg-gray-900 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl cursor-pointer
                          transition-all duration-200
                          hover:bg-gray-50 dark:hover:bg-gray-800
                          peer-checked:border-indigo-600 dark:peer-checked:border-indigo-500 
                          peer-checked:bg-gradient-to-r peer-checked:from-indigo-50 peer-checked:to-purple-50
                          dark:peer-checked:from-indigo-900/30 dark:peer-checked:to-purple-900/30"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">Free Listing</h3>
                          <span className="px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                            Active
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Basic listing visibility
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Standard search placement
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            Basic analytics
                          </li>
                        </ul>
                      </label>
                    </div>

                    {/* Premium Listing Option */}
                    <div className="relative">
                      {/* Coming Soon Badge */}
                      <div className="absolute -top-2 -right-2 z-20">
                        <span className="px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-full shadow-sm">
                          Coming Soon
                        </span>
                      </div>

                      {/* Premium Card */}
                      <div className="p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-indigo-100 dark:border-indigo-800 rounded-xl relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                              Premium Listing
                            </h3>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Benefits List */}
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">Featured placement in search results</span>
                          </li>

                          <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">Detailed performance analytics</span>
                          </li>

                          <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-gray-100">Priority customer support</span>
                          </li>
                        </ul>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-600/5 to-pink-600/5 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full -ml-16 -mb-16" />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-[1px] rounded-xl cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Fixed to bottom on mobile */}
            <div className="sticky bottom-0 left-0 right-0 z-50 mt-8 pb-4 md:pb-0">
              <div className="px-4 py-3 bg-white dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700/75 shadow-lg md:shadow-none md:border-0 md:bg-transparent backdrop-blur-sm">
                <div className="container mx-auto max-w-5xl">
                  <div className="flex gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm md:text-base font-medium 
                        transition-all duration-200 ${
                          currentStep === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
                        }`}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </button>
                    
                    {currentStep === STEPS.length - 1 ? (
                      <button
                        type="submit"
                        disabled={!isStepComplete(currentStep) || isUpdating}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm md:text-base font-medium 
                          text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                          dark:from-indigo-500 dark:to-purple-500 
                          hover:from-indigo-700 hover:to-purple-700 
                          dark:hover:from-indigo-600 dark:hover:to-purple-600
                          disabled:opacity-50 transition-all duration-200 active:scale-95`}
                        >
                          {isUpdating ? 'Creating...' : 'Create Listing'}
                        </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!isStepComplete(currentStep)}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm md:text-base font-medium 
                          text-white bg-gradient-to-r from-indigo-600 to-purple-600 
                          dark:from-indigo-500 dark:to-purple-500 
                          hover:from-indigo-700 hover:to-purple-700 
                          dark:hover:from-indigo-600 dark:hover:to-purple-600
                          disabled:opacity-50 transition-all duration-200 active:scale-95`}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* Draft Status - Moved to top with better styling */}
          <div className="mt-6 p-3 bg-white dark:bg-gray-900/50 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500 dark:bg-indigo-400"></span>
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Auto-saving draft</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to discard this draft?')) {
                    clearDraft();
                    window.location.reload();
                  }
                }}
                className="text-[11px] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 
                  flex items-center space-x-1 px-2 py-0.5 rounded-md 
                  hover:bg-red-50/50 dark:hover:bg-red-900/20 
                  active:scale-95 transition-all duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Discard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add the LocationModal component */}
      <ListingLocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationSelect}
      />
    </div>
  );
};

export default CreateListingForm;