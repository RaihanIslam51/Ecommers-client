"use client";
import React from "react";

/**
 * Product Card Skeleton Loader
 * Professional loading animation that mimics the actual product card layout
 * @returns {JSX.Element} Skeleton loader for product card
 */
const ProductCardSkeleton = () => {
  return (
    <div className="relative w-full bg-white border border-gray-200 overflow-hidden">
      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/60 to-transparent z-10" />
      
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-gray-100">
        {/* Badge Skeleton */}
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300/70 animate-pulse" />
        
        {/* Action Icons Skeleton */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="w-9 h-9 bg-gray-300/70 animate-pulse" />
          <div className="w-9 h-9 bg-gray-300/70 animate-pulse animation-delay-100" />
          <div className="w-9 h-9 bg-gray-300/70 animate-pulse animation-delay-200" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
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
          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse animation-delay-300" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-20 bg-gray-300/70 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse animation-delay-100" />
        </div>

        {/* Add to Cart Button Skeleton */}
        <div className="h-9 bg-gray-200 animate-pulse animation-delay-200" />
      </div>
    </div>
  );
};

/**
 * Grid of Product Card Skeletons
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 * @returns {JSX.Element} Grid of skeleton loaders
 */
export const ProductCardSkeletonGrid = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
