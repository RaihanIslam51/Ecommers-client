"use client";
import Image from "next/image";
import React from "react";

const RightBanner = () => {
  return (
    <div className="relative w-full h-64 md:h-full bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group">
      {/* Background Image */}
      <Image
        src="https://i.ibb.co/b5NrY9ZS/image-Right.jpg"
        alt="Featured Products - BDMart"
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
        sizes="(max-width: 768px) 100vw, 66vw"
      />

      {/* Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
        {/* Promotional Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs md:text-sm font-semibold shadow-lg">
            ⚡ Limited Time Offer
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
          Exclusive Deals
          <br />
          <span className="text-yellow-400">Up to 50% Off</span>
        </h2>

        {/* Description */}
        <p className="text-sm md:text-lg text-gray-100 mb-6 md:mb-8 max-w-md drop-shadow-md">
          Get the best wholesale prices directly from trusted suppliers across Bangladesh
        </p>

        {/* CTA Button */}
        <div>
          <button className="group/btn inline-flex items-center gap-2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <span>Shop Now</span>
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover/btn:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-4 right-12 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default RightBanner;
