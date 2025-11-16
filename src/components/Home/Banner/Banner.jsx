"use client";
import React, { useState, useEffect } from "react";
import LeftBanner from "./Components/RightBanner.jsx/LeftBanner";
import RightBanner from "./Components/RightBanner.jsx/RightBanner";


// ==================== LOADING COMPONENTS ====================

/**
 * Skeleton Loader for Main Banner
 */
const MainBannerSkeleton = () => (
  <div className="relative w-full h-72 md:h-full bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 rounded-xl overflow-hidden">
    {/* Shimmer Animation */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent" />
    
    {/* Content Placeholders */}
    <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 space-y-4">
      {/* Badge Skeleton */}
      <div className="w-32 h-8 bg-gray-300/70 rounded-full animate-pulse" />
      
      {/* Title Skeleton */}
      <div className="space-y-3">
        <div className="w-3/4 h-10 md:h-14 bg-gray-300/70 rounded-lg animate-pulse" />
        <div className="w-1/2 h-10 md:h-14 bg-gray-300/70 rounded-lg animate-pulse animation-delay-100" />
      </div>
      
      {/* Description Skeleton */}
      <div className="space-y-2 max-w-xl">
        <div className="w-full h-4 bg-gray-300/50 rounded animate-pulse animation-delay-200" />
        <div className="w-5/6 h-4 bg-gray-300/50 rounded animate-pulse animation-delay-300" />
      </div>
      
      {/* Button Skeleton */}
      <div className="w-36 h-12 bg-gray-300/70 rounded-xl animate-pulse animation-delay-400" />
    </div>
  </div>
);

/**
 * Skeleton Loader for Side Banner
 */
const SideBannerSkeleton = () => (
  <div className="relative w-full h-full bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 rounded-xl overflow-hidden">
    {/* Shimmer Animation */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent animation-delay-200" />
    
    {/* Content Placeholders */}
    <div className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-8 space-y-3">
      {/* Badge Skeleton */}
      <div className="w-24 h-6 bg-gray-300/70 rounded-full animate-pulse" />
      
      {/* Title Skeleton */}
      <div className="w-3/4 h-8 bg-gray-300/70 rounded-lg animate-pulse animation-delay-100" />
      
      {/* Description Skeleton */}
      <div className="w-full h-3 bg-gray-300/50 rounded animate-pulse animation-delay-200" />
      
      {/* Button Skeleton */}
      <div className="w-28 h-10 bg-gray-300/70 rounded-lg animate-pulse animation-delay-300" />
    </div>
  </div>
);

/**
 * Skeleton Loader for Support Features
 */
const SupportSkeleton = () => (
  <div className="space-y-6">
    {/* Announcement Banner Skeleton */}
    <div className="bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 py-3 px-6 rounded-xl md:rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
      <div className="h-6 bg-gray-400/50 rounded animate-pulse" />
    </div>
    
    {/* Feature Cards Skeleton */}
    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-6 overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-gray-100 to-transparent"
            style={{ animationDelay: `${index * 150}ms` }}
          />
          <div className="flex items-start gap-4">
            {/* Icon Skeleton */}
            <div className="shrink-0 w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
            
            {/* Text Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse animation-delay-100" />
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
    {/* Hero Banner Container */}
    <div className="relative  md:mb-8 lg:mb-10">
      <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 items-stretch md:h-[420px] lg:h-[480px]">
          {/* Main Banner Skeleton */}
          <div className="col-span-1 md:col-span-2 w-full h-72 md:h-full">
            <MainBannerSkeleton />
          </div>

          {/* Side Banner Skeleton */}
          <div className="hidden md:block md:col-span-1 w-full h-full">
            <SideBannerSkeleton />
          </div>
        </div>
      </div>
    </div>

    {/* Support Features Skeleton */}
    {/* <SupportSkeleton /> */}
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
    <section className="w-full  bg-linear-to-b from-gray-50 via-white to-gray-50 pt-0 pb-6 md:pb-8 lg:pb-10">
      {isLoading ? (
        <BannerSkeleton />
      ) : (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Banner Container */}
          <div className="relative mb-6 md:mb-8 lg:mb-10 animate-fade-in">
            {/* Banner Grid Wrapper */}
            <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 items-stretch md:h-[420px] lg:h-[480px]">
                {/* Main Featured Banner - 2/3 width on desktop */}
                <div className="col-span-1 md:col-span-2 w-full h-72 md:h-full">
                  <RightBanner />
                </div>

                {/* Secondary Side Banner - 1/3 width on desktop, hidden on mobile */}
                <div className="hidden md:block md:col-span-1 w-full h-full">
                  <LeftBanner />
                </div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl -z-10 hidden lg:block" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl -z-10 hidden lg:block" />
          </div>

         
        </div>
      )}
    </section>
  );
};

export default Banner;
