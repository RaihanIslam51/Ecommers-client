import React from "react";

const LeftBanner = () => {
  return (
    <div className="relative w-full h-full bg-linear-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden group">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: "url('https://picsum.photos/600/600')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-gray-900/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        {/* Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
            NEW ARRIVAL
          </span>
        </div>

        {/* Heading */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
          Special Offers
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-200 mb-4">
          Check out the latest deals and exclusive discounts
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-max">
          <span>Explore</span>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Decorative Gradient Orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default LeftBanner;
