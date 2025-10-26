"use client";
import React from "react";
import { FaUserTie, FaRegCommentDots } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

// ==================== CONSTANTS ====================
const SUPPORT_FEATURES = [
  {
    id: 1,
    title: "24/7 Online Support",
    description: "Expert assistance anytime",
    icon: FaUserTie,
    iconSize: 24,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Raise a Complaint",
    description: "Quick resolution guaranteed",
    icon: FaRegCommentDots,
    iconSize: 24,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    title: "Nationwide Delivery",
    description: "Cash on delivery in 64 districts",
    icon: TbTruckDelivery,
    iconSize: 24,
    gradient: "from-green-500 to-emerald-500",
  },
];

const ANNOUNCEMENTS = [
  "⚡ Fast delivery across Bangladesh",
  "🎁 Free returns within 7 days",
  "🔒 Secure payments & verified sellers",
  "✨ Special discounts for bulk orders",
];

// ==================== COMPONENTS ====================

/**
 * Announcement Banner Component
 * Displays scrolling promotional messages
 */
const AnnouncementBanner = () => (
  <div className="mb-6">
    <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 px-6 rounded-xl md:rounded-2xl shadow-lg overflow-hidden relative group">
      {/* Animated Shimmer Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      {/* Scrolling Text */}
      <marquee
        behavior="scroll"
        direction="left"
        className="font-medium text-sm md:text-base"
        aria-label="Promotional announcements"
      >
        {ANNOUNCEMENTS.join(" · ")}
      </marquee>
    </div>
  </div>
);

/**
 * Feature Card Component
 * Individual support feature with icon and description
 */
const FeatureCard = ({ feature }) => {
  const IconComponent = feature.icon;

  return (
    <div className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Icon Container with Gradient on Hover */}
        <div className="shrink-0 w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-linear-to-br group-hover:from-gray-900 group-hover:to-gray-700 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md">
          <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
            <IconComponent size={feature.iconSize} />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-900 transition-colors">
            {feature.title}
          </h4>
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
            {feature.description}
          </p>
        </div>

        {/* Arrow Icon - appears on hover */}
        <div className="shrink-0 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
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
        </div>
      </div>
    </div>
  );
};

/**
 * Feature Grid Component
 * Grid layout for all support features
 */
const FeatureGrid = () => (
  <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
    {SUPPORT_FEATURES.map((feature) => (
      <FeatureCard key={feature.id} feature={feature} />
    ))}
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Support Features Section
 * Displays announcement banner and support feature cards
 * @returns {JSX.Element} Support section with announcements and features
 */
const Support = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <AnnouncementBanner />
      <FeatureGrid />
    </div>
  );
};

export default Support;
