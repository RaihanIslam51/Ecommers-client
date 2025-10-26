"use client";
import React from "react";

/**
 * Store Product Card Skeleton Loader
 * Professional loading animation for store page product cards
 * @param {Object} props - Component props
 * @param {string} props.viewType - View type: 'grid' or 'list'
 * @returns {JSX.Element} Skeleton loader for store product card
 */
const StoreProductCardSkeleton = ({ viewType = 'grid' }) => {
  if (viewType === 'list') {
    return (
      <div className="relative bg-white rounded-lg border border-gray-200 p-4 overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />
        
        <div className="flex gap-4">
          {/* Image Skeleton */}
          <div className="shrink-0 w-32 h-32 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 rounded-lg" />
          
          {/* Content Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2 animation-delay-100" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse animation-delay-200" />
              <div className="h-4 w-16 bg-gray-100 rounded animate-pulse animation-delay-300" />
            </div>
            
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse animation-delay-400" />
          </div>
        </div>
      </div>
    );
  }

  // Grid View Skeleton
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />
      
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-linear-to-br from-gray-200 via-gray-100 to-gray-200">
        {/* Badge Skeleton */}
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300/70 rounded-md animate-pulse" />
        
        {/* Wishlist Icon Skeleton */}
        <div className="absolute top-3 right-3 w-9 h-9 bg-gray-300/70 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category Skeleton */}
        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 animation-delay-100" />
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse"
                style={{ animationDelay: `${star * 50}ms` }}
              />
            ))}
          </div>
          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse animation-delay-300" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-baseline gap-2 pt-2">
          <div className="h-6 w-24 bg-gray-300/70 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse animation-delay-100" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse animation-delay-200" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse animation-delay-300" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of Store Product Card Skeletons
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 * @param {string} props.viewType - View type: 'grid' or 'list'
 * @returns {JSX.Element} Grid/List of skeleton loaders
 */
export const StoreProductCardSkeletonGrid = ({ count = 12, viewType = 'grid' }) => {
  return (
    <div className={`
      ${viewType === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'flex flex-col gap-6'
      } p-6
    `}>
      {Array.from({ length: count }).map((_, index) => (
        <StoreProductCardSkeleton key={index} viewType={viewType} />
      ))}
    </div>
  );
};

export default StoreProductCardSkeleton;
