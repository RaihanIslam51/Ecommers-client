"use client";
import React from "react";
import { FaUserTie, FaRegCommentDots } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const supportFeatures = [
  {
    id: 2,
    title: "24/7 Online Support",
    description: "Expert assistance anytime",
    icon: <FaUserTie size={24} />,
    color: "blue",
  },
  {
    id: 3,
    title: "Raise a Complaint",
    description: "Quick resolution guaranteed",
    icon: <FaRegCommentDots size={24} />,
    color: "orange",
  },
  {
    id: 4,
    title: "Nationwide Delivery",
    description: "Cash on delivery in 64 districts",
    icon: <TbTruckDelivery size={24} />,
    color: "green",
  },
];

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Announcement Banner */}
      <div className="mb-6">
        <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 px-6 rounded-xl shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          <marquee
            behavior="scroll"
            direction="left"
            className="font-medium text-sm md:text-base"
            aria-label="Promotional announcements"
          >
            ⚡ Fast delivery across Bangladesh · 🎁 Free returns within 7 days · 🔒 Secure payments & verified sellers · ✨ Special discounts for bulk orders
          </marquee>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportFeatures.map((feature) => (
          <div
            key={feature.id}
            className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              {/* Icon Container */}
              <div className={`shrink-0 w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-all duration-300 shadow-sm`}>
                <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
