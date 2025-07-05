'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function ImageGallery({ images, title }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex >= images.length) return 0;
      if (newIndex < 0) return images.length - 1;
      return newIndex;
    });
  };

  return (
    <>
      <div className={`relative ${isLargeScreen ? 'lg:sticky lg:top-4' : ''}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
          {/* Main Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Thumbs, FreeMode]}
            navigation
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-white/70 !opacity-50',
              bulletActiveClass: '!opacity-100'
            }}
            thumbs={{ swiper: thumbsSwiper }}
            className="aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="relative">
                <div className="relative w-full h-full group cursor-pointer" onClick={() => openLightbox(index)}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${image}`}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Navigation, Thumbs]}
                spaceBetween={8}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                className="thumbs-swiper"
              >
                {images.map((image, index) => (
                  <SwiperSlide 
                    key={index}
                    className="w-20 h-20 cursor-pointer rounded-lg overflow-hidden opacity-50 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${image}`}
                        alt={`${title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* Image counter badge */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </div>
      </div>

      {/* Lightbox Portal Container */}
      <div id="lightbox-root" className="relative z-[9999]">
        {/* Lightbox */}
        {lightboxOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/95" 
              onClick={closeLightbox}
              style={{ zIndex: 99999 }}
            />
            
            {/* Lightbox Content */}
            <div className="fixed inset-0 flex flex-col" style={{ zIndex: 99999 }}>
              {/* Header */}
              <div className="relative flex items-center justify-between px-4 h-14 bg-black">
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
                <button
                  onClick={closeLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Main Image Container */}
              <div className="flex-1 relative flex items-center justify-center bg-black">
                {/* Navigation Buttons */}
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-0 z-10 h-full sm:h-auto sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center text-white/90 hover:text-white bg-gradient-to-r from-black/50 to-transparent sm:bg-black/50 sm:m-4 sm:rounded-full sm:p-3 transition-all"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Main Image */}
                <div className="w-full h-full flex items-center justify-center px-0 sm:px-20">
                  <div className="relative w-full h-[calc(100vh-180px)]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${images[currentImageIndex]}`}
                      alt={`${title} - Full size ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                      quality={100}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-0 z-10 h-full sm:h-auto sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center text-white/90 hover:text-white bg-gradient-to-l from-black/50 to-transparent sm:bg-black/50 sm:m-4 sm:rounded-full sm:p-3 transition-all"
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="relative bg-black border-t border-white/10">
                <div className="px-4 py-3">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all duration-200 ${
                          currentImageIndex === index 
                            ? 'ring-2 ring-white scale-105' 
                            : 'opacity-40 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIACDN}/uploads/${image}`}
                          alt={`${title} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
} 