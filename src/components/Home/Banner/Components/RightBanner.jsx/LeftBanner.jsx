"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useBanners } from "@/context/DataCacheContext";

// ==================== CONSTANTS ====================
const DEFAULT_BANNER = {
  title: "Healthy Food Combos",
  subtitle: "NEW ARRIVAL",
  description: "Pre-cut vegetables and portioned meal kits for easy cooking.",
  image: "https://picsum.photos/600/600",
  buttonText: "Explore",
  buttonLink: "/store",
};

// ==================== COMPONENTS ====================


/**
 * Loading Skeleton for Side Banner
 */
const LeftBannerSkeleton = () => (
  <div className="relative w-full h-full bg-gradient-to-br from-[#f5f3f0] via-[#fafaf8] to-[#f0ede6] overflow-hidden border border-[#e8e6e0]">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#e8e6e0] border-t-[#1a1a1a] rounded-full animate-spin" />
    </div>
  </div>
);

/**
 * Side Banner Content Component
 */
const SideBannerContent = ({ banner }) => (
  <div className="relative z-10 flex flex-col justify-end h-full p-6 lg:p-8">
    {/* Subtitle */}
    {banner.subtitle && (
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {banner.subtitle}
      </p>
    )}

    {/* Heading */}
    <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-white mb-3 leading-tight tracking-[-0.01em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {banner.title}
    </h3>

    {/* Description */}
    {banner.description && (
      <p className="text-xs text-white/70 mb-6 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {banner.description}
      </p>
    )}

    {/* CTA */}
    {banner.buttonText && (
      <Link
        href={banner.buttonLink || "/store"}
        className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 w-max shadow-md hover:shadow-lg transform hover:scale-105"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <span>{banner.buttonText}</span>
        <svg className="w-3.5 h-3.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    )}
  </div>
);

const DecorativeOrbs = () => null;

// ==================== MAIN COMPONENT ====================

/**
 * Left Side Banner Component
 * Displays secondary promotional banner with dynamic content from API
 * @returns {JSX.Element} Side banner with image, overlay and CTA
 */
const LeftBanner = () => {
  // Use prefetched + cached banners (filter by position 'left')
  const { data: allBanners, loading } = useBanners();
  const bannerData = (allBanners || []).find(b => b.position === 'left') || null;

  // Use fetched banner or fallback to default
  const displayBanner = bannerData || DEFAULT_BANNER;

  // Show loading skeleton while fetching
  if (loading) {
    return <LeftBannerSkeleton />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={displayBanner.image}
        alt={displayBanner.title || "Side banner image"}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
        priority
        sizes="33vw"
      />
      {/* Premium Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <SideBannerContent banner={displayBanner} />
    </div>
  );
};

export default LeftBanner;
