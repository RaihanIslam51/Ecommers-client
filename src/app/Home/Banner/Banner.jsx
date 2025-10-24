"use client";
import React from 'react';
import LeftBanner from './Components/RightBanner.jsx/LeftBanner';
import RightBanner from './Components/RightBanner.jsx/RightBanner';
import Support from './Components/RightBanner.jsx/Support';


const Banner = () => {
  return (
  <section className="w-full bg-transparent">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="relative -mt-4 md:mt-0">
  <div className="bg-linear-to-b from-white/5 to-black/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch md:h-96">
            {/* Right Banner - spans 2 columns on md+ */}
            <div className="col-span-1 md:col-span-2 w-full">
              <RightBanner />
            </div>

            {/* Left Banner - 1 column on md+; hidden on small screens (keeps same behavior) */}
            <div className="hidden md:block md:col-span-1 w-full">
              <LeftBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Support bar placed under the hero with comfortable spacing */}
      <div className="mt-6">
        <Support />
      </div>
    </div>
  </section>
  );
};

export default Banner;
