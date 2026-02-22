"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

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
  <div className="relative w-full h-full  bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
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
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
        {banner.subtitle}
      </p>
    )}

    {/* Heading */}
    <h3 className="text-xl md:text-2xl lg:text-2xl font-black text-white mb-2 leading-tight tracking-tight">
      {banner.title}
    </h3>

    {/* Description */}
    {banner.description && (
      <p className="text-xs text-white/70 mb-5 leading-relaxed">
        {banner.description}
      </p>
    )}

    {/* CTA */}
    {banner.buttonText && (
      <Link
        href={banner.buttonLink || "/store"}
        className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-black hover:text-white transition-colors duration-300 w-max"
      >
        <span>{banner.buttonText}</span>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeftBanner();
  }, []);

  /**
   * Fetch left banner data from API
   */
  const fetchLeftBanner = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/banners/position/left");
      // Server returns: { success: true, message: "...", banners: [...] }
      if (response.data.success && response.data.banners?.length > 0) {
        setBanner(response.data.banners[0]);
      }
    } catch (error) {
      console.error("Error fetching left banner:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use fetched banner or fallback to default
  const displayBanner = banner || DEFAULT_BANNER;

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
        className="object-cover"
        priority
        sizes="33vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <SideBannerContent banner={displayBanner} />
    </div>
  );
};

export default LeftBanner;
