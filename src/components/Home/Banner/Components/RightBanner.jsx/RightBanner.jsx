"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

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
  <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 lg:px-16">
    {/* Promotional Badge */}
    {(banner.subtitle || DEFAULT_BANNER.subtitle) && (
      <div className="mb-4 animate-fade-in">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs md:text-sm font-semibold shadow-lg hover:bg-white/30 transition-all duration-300">
          {banner.subtitle || DEFAULT_BANNER.subtitle}
        </span>
      </div>
    )}

    {/* Main Heading */}
    <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-4 md:mb-5 leading-tight drop-shadow-2xl animate-slide-up">
      {banner.title || DEFAULT_BANNER.title}
    </h2>

    {/* Description */}
    {(banner.description || DEFAULT_BANNER.description) && (
      <p className="text-sm md:text-base lg:text-lg text-gray-100 mb-6 md:mb-8 max-w-xl leading-relaxed drop-shadow-lg animate-slide-up animation-delay-100">
        {banner.description || DEFAULT_BANNER.description}
      </p>
    )}

    {/* Call-to-Action Button */}
    {(banner.buttonText || DEFAULT_BANNER.buttonText) && (
      <div className="animate-slide-up animation-delay-200">
        <Link
          href={banner.buttonLink || DEFAULT_BANNER.buttonLink}
          className="group inline-flex items-center gap-3 bg-white  text-gray-900  px-6 md:px-8 lg:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          <span>{banner.buttonText || DEFAULT_BANNER.buttonText}</span>
          <svg
            className="w-5 h-5 transition-transform duration-300 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    )}
  </div>
);

/**
 * Decorative Elements Component
 */
const DecorativeElements = () => (
  <>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-0 right-20 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slow animation-delay-300" />
    <div className="absolute top-1/2 left-0 w-2 h-24 bg-linear-to-b from-transparent via-white/50 to-transparent blur-sm" />
  </>
);

// ==================== MAIN COMPONENT ====================

/**
 * Main Right Banner Component
 * Displays the primary hero banner with dynamic content from API
 * @returns {JSX.Element} Right banner with image, text overlay and CTA
 */
const RightBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRightBanner();
  }, []);

  /**
   * Fetch banner data from API
   */
  const fetchRightBanner = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/banners/position/right");
      // Server returns: { success: true, message: "...", banners: [...] }
      if (response.data.success && response.data.banners?.length > 0) {
        setBanner(response.data.banners[0]);
      }
    } catch (error) {
      console.error("Error fetching right banner:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use fetched banner or fallback to default
  const displayBanner = banner || DEFAULT_BANNER;

  // Show loading skeleton while fetching
  if (loading) {
    return <BannerSkeleton />;
  }

  return (
    <div className="relative w-full h-64 md:h-full rounded-xl overflow-hidden group">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={displayBanner.image}
          alt={displayBanner.title || "Banner image"}
          fill
          className="object-cover transition-transform duration-700"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>

      {/* Gradient Overlays for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/30" />

      {/* Content Overlay */}
      <BannerContent banner={displayBanner} />

      {/* Decorative Elements */}
      <DecorativeElements />
    </div>
  );
};

export default RightBanner;
