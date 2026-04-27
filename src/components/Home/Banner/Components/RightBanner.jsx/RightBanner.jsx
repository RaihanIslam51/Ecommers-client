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
  <div className="relative w-full h-64 md:h-full bg-gradient-to-br from-[#f5f3f0] via-[#fafaf8] to-[#f0ede6] overflow-hidden border border-[#e8e6e0]">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#e8e6e0] border-t-[#1a1a1a] rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#666] rounded-full animate-spin animation-delay-150" />
      </div>
    </div>
  </div>
);

/**
 * Banner Content Overlay Component
 */
const BannerContent = ({ banner }) => (
  <div className="relative z-10 flex flex-col justify-end h-full px-8 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16">
    {/* Subtitle tag */}
    {/* {(banner.subtitle || DEFAULT_BANNER.subtitle) && (
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {banner.subtitle || DEFAULT_BANNER.subtitle}
      </p>
    )} */}

    {/* Main Heading */}
    {/* {(banner.title || DEFAULT_BANNER.title) && (
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight tracking-[-0.02em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {banner.title || DEFAULT_BANNER.title}
      </h2>
    )} */}

    {/* Description */}
    {(banner.description || DEFAULT_BANNER.description) && (
      <p className="text-sm md:text-base text-white/70 mb-8 max-w-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {banner.description || DEFAULT_BANNER.description}
      </p>
    )}

    {/* CTA */}
    {(banner.buttonText || DEFAULT_BANNER.buttonText) && (
      <Link
        href={banner.buttonLink || DEFAULT_BANNER.buttonLink}
        className="inline-flex items-center gap-3 bg-white text-black px-7 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 w-max shadow-lg hover:shadow-xl transform hover:scale-105"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <span>{banner.buttonText || DEFAULT_BANNER.buttonText}</span>
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
        className="object-cover transition-transform duration-500 hover:scale-105"
        priority
        sizes="(max-width: 768px) 100vw, 66vw"
      />
      {/* Premium Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <BannerContent banner={displayBanner} />
    </div>
  );
};

export default RightBanner;
