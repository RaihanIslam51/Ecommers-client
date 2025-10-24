import React from "react";

const LeftBanner = () => {
  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
      {/* Background image - dummy image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://picsum.photos/600/600')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0  bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-6">
        {/* <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">
          Special Offers
        </h3>
        <p className="text-sm md:text-base mb-4">
          Check out the latest deals and discounts.
        </p>
        <button className="bg-green-600 hover:bg-green-700 transition  px-3 py-2 md:px-5 md:py-3 rounded-lg font-semibold w-max">
          Explore
        </button> */}
      </div>
    </div>
  );
};

export default LeftBanner;
