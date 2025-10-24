"use client";
import React from 'react';
import LeftBanner from './Components/RightBanner.jsx/LeftBanner';
import RightBanner from './Components/RightBanner.jsx/RightBanner';
import Support from './Components/RightBanner.jsx/Support';


const Banner = () => {
  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero Banner Grid */}
        <div className="relative">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch md:h-[400px]">
              {/* Main Banner - spans 2 columns on md+ */}
              <div className="col-span-1 md:col-span-2 w-full">
                <RightBanner />
              </div>

              {/* Side Banner - 1 column on md+; hidden on small screens */}
              <div className="hidden md:block md:col-span-1 w-full">
                <LeftBanner />
              </div>
            </div>
          </div>
        </div>

        {/* Support Features Bar */}
        <div className="mt-6 md:mt-8">
          <Support />
        </div>
      </div>
    </section>
  );
};

export default Banner;
