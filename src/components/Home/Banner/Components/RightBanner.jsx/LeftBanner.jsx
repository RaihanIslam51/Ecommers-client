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
  <div className="relative w-full h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden animate-pulse">
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
    {/* Badge/Subtitle */}
    {banner.subtitle && (
      <div className="mb-3 animate-fade-in">
        <span className="inline-block px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-colors duration-300">
          {banner.subtitle}
        </span>
      </div>
    )}

    {/* Heading */}
    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg animate-slide-up">
      {banner.title}
    </h3>

    {/* Description */}
    {banner.description && (
      <p className="text-sm text-gray-200 mb-4 leading-relaxed drop-shadow-md animate-slide-up animation-delay-100">
        {banner.description}
      </p>
    )}

    {/* CTA Button */}
    {banner.buttonText && (
      <div className="animate-slide-up animation-delay-200">
        <Link
          href={banner.buttonLink || "/store"}
          className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-max"
        >
          <span>{banner.buttonText}</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    )}
  </div>
);

/**
 * Decorative Gradient Orbs
 */
const DecorativeOrbs = () => (
  <>
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl animate-pulse-slow animation-delay-500" />
  </>
);

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
    <div className="relative w-full h-full bg-linear-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-xl overflow-hidden group">
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={displayBanner.image}
          alt={displayBanner.title || "Side banner image"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority
          sizes="33vw"
        />
      </div>

      {/* Multi-layer Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/10 to-black/30" />

      {/* Content Layer */}
      <SideBannerContent banner={displayBanner} />

      {/* Decorative Elements */}
      <DecorativeOrbs />
    </div>
  );
};

export default LeftBanner;
