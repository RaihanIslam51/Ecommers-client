"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useBanners } from "@/context/DataCacheContext";

// ==================== CONSTANTS ====================
const DEFAULT_BANNER = {
  title: "Fresh Vegetables & Meal Kits",
  subtitle: "🍎 Organic & Hygienic",
  description:
    "Discover fresh, organic vegetables and ready-to-cook meal packages. Hygienically prepared for your healthy lifestyle.",
  image: "https://i.ibb.co/b5NrY9ZS/image-Right.jpg",
  buttonText: "Shop Now",
  buttonLink: "/store",
};

// ==================== COMPONENTS ====================

/**
 * Loading Skeleton for Banner
 */
const BannerSkeleton = () => (
  <div className="relative w-full h-64 md:h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-gray-600 rounded-full animate-spin animation-delay-150" />
      </div>
    </div>
  </div>
);

/**
 * Banner Content Overlay Component
 */
const BannerContent = ({ banner }) => (
  <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-12 lg:px-16 pb-10 md:pb-14">
    {/* Subtitle tag */}
    {/* {(banner.subtitle || DEFAULT_BANNER.subtitle) && (
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
        {banner.subtitle || DEFAULT_BANNER.subtitle}
      </p>
    )} */}

    {/* Main Heading */}
    {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
      {banner.title || DEFAULT_BANNER.title}
    </h2> */}

    {/* Description */}
    {/* {(banner.description || DEFAULT_BANNER.description) && (
      <p className="text-sm md:text-base text-white/75 mb-7 max-w-md leading-relaxed">
        {banner.description || DEFAULT_BANNER.description}
      </p>
    )} */}

    {/* CTA */}
    {(banner.buttonText || DEFAULT_BANNER.buttonText) && (
      <Link
        href={banner.buttonLink || DEFAULT_BANNER.buttonLink}
        className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 text-sm font-semibold tracking-wide hover:bg-black hover:text-white transition-colors duration-300 w-max"
      >
        <span>{banner.buttonText || DEFAULT_BANNER.buttonText}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    )}
  </div>
);

const DecorativeElements = () => null;

// ==================== MAIN COMPONENT ====================

/**
 * Main Right Banner Component
 * Displays the primary hero banner with dynamic content from API
 * @returns {JSX.Element} Right banner with image, text overlay and CTA
 */
const RightBanner = () => {
  // Use prefetched + cached banners (filter by position 'right')
  const { data: allBanners, loading } = useBanners();
  const bannerData = (allBanners || []).find(b => b.position === 'right') || null;

  // Use fetched banner or fallback to default
  const displayBanner = bannerData || DEFAULT_BANNER;

  // Show loading skeleton while fetching
  if (loading) {
    return <BannerSkeleton />;
  }

  return (
    <div className="relative w-full h-64 md:h-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={displayBanner.image}
        alt={displayBanner.title || "Banner image"}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 66vw"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <BannerContent banner={displayBanner} />
    </div>
  );
};

export default RightBanner;
