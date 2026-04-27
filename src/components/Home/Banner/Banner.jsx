"use client";
import React, { useState, useEffect } from "react";
import LeftBanner from "./Components/RightBanner.jsx/LeftBanner";
import RightBanner from "./Components/RightBanner.jsx/RightBanner";


// ==================== LOADING COMPONENTS ====================

/**
 * Skeleton Loader for Main Banner
 */
const MainBannerSkeleton = () => (
  <div className="relative w-full h-full bg-white border border-gray-200 overflow-hidden">
    {/* Shimmer Animation - Luxury effect */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    
    {/* Content Placeholders */}
    <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 space-y-6">
      {/* Badge Skeleton */}
      <div className="w-32 h-7 bg-gray-300/70 animate-pulse" />
      
      {/* Title Skeleton */}
      <div className="space-y-4">
        <div className="w-3/4 h-12 md:h-16 bg-gray-300/70 animate-pulse" />
        <div className="w-1/2 h-12 md:h-16 bg-gray-300/70 animate-pulse animation-delay-100" />
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="w-full h-4 bg-gray-200 animate-pulse animation-delay-200" />
        <div className="w-5/6 h-4 bg-gray-200 animate-pulse animation-delay-300" />
      </div>
      
      {/* Button Skeleton */}
      <div className="w-40 h-11 bg-gray-300/70 animate-pulse animation-delay-400" />
    </div>
  </div>
);

/**
 * Skeleton Loader for Side Banner
 */
const SideBannerSkeleton = () => (
  <div className="relative w-full h-full bg-white border border-gray-200 overflow-hidden">
    {/* Shimmer Animation */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent animation-delay-200" />
    
    {/* Content Placeholders */}
    <div className="relative z-10 flex flex-col justify-end h-full p-8 space-y-4">
      {/* Badge Skeleton */}
      <div className="w-24 h-6 bg-gray-300/70 animate-pulse" />
      
      {/* Title Skeleton */}
      <div className="w-3/4 h-8 bg-gray-300/70 animate-pulse animation-delay-100" />
      
      {/* Description Skeleton */}
      <div className="w-full h-4 bg-gray-200 animate-pulse animation-delay-200" />
      
      {/* Button Skeleton */}
      <div className="w-32 h-10 bg-gray-300/70 animate-pulse animation-delay-300" />
    </div>
  </div>
);

/**
 * Skeleton Loader for Support Features
 */
const SupportSkeleton = () => (
  <div className="space-y-6">
    {/* Announcement Banner Skeleton */}
    <div className="bg-white py-4 px-6 overflow-hidden relative border border-gray-200">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="h-5 bg-gray-300/70 animate-pulse w-3/4" />
    </div>
    
    {/* Feature Cards Skeleton */}
    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 p-6 overflow-hidden relative hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ animationDelay: `${index * 150}ms` }}
          />
          <div className="flex items-start gap-5">
            {/* Icon Skeleton */}
            <div className="shrink-0 w-14 h-14 bg-gray-300/70 animate-pulse" />
            
            {/* Text Skeleton */}
            <div className="flex-1 space-y-3">
              <div className="w-3/4 h-5 bg-gray-300/70 animate-pulse" />
              <div className="w-full h-4 bg-gray-200 animate-pulse animation-delay-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Complete Banner Skeleton Loader
 */
const BannerSkeleton = () => (
  <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:h-[500px] lg:h-[560px]">
      <div className="col-span-1 md:col-span-2 w-full h-64 md:h-full bg-gray-100 animate-pulse border border-gray-200" />
      <div className="hidden md:block md:col-span-1 w-full h-full bg-gray-100 animate-pulse border border-gray-200" />
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Main Banner Section Component
 * Displays hero banners and support features in a modern, responsive layout
 * @returns {JSX.Element} Banner section with main and side banners plus support features
 */
const Banner = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading from database
    // This creates a realistic loading experience for users
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-white pt-0">
      {isLoading ? (
        <BannerSkeleton />
      ) : (
        <div className="w-full mx-auto">
          <div className="grid pt-3 grid-cols-1 md:grid-cols-3 gap-3 md:h-[500px] lg:h-[560px] animate-fade-in">
            {/* Main Featured Banner — 2/3 width */}
            <div className="col-span-1 md:col-span-2 w-full h-64 md:h-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              <RightBanner />
            </div>
            {/* Side Banner — 1/3 width, hidden on mobile */}
            <div className="hidden md:block md:col-span-1 w-full h-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              <LeftBanner />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
