"use client";
import Image from "next/image";
import React from "react";



const RightBanner = () => {
  return (
    <div className="relative text-black w-full h-64 md:h-96 bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Background image */}
      <Image
        src="/public/imageRight.webp"
        alt="Right Banner"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 ">
        <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">
          Exclusive Deals on Electronics
        </h2>
        <p className="text-sm md:text-lg mb-4 md:mb-6">
          Get the best wholesale prices directly from trusted suppliers.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 transition  px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold w-max">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default RightBanner;
