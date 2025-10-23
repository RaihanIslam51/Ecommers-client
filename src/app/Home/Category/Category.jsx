"use client";
import React, { useState } from "react";
import {
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaCouch,
  FaBook,
  FaGift,
} from "react-icons/fa";

const categories = [
  { id: 1, name: "Electronics", icon: <FaLaptop size={40} /> },
  { id: 2, name: "Mobiles", icon: <FaMobileAlt size={40} /> },
  { id: 3, name: "Fashion", icon: <FaTshirt size={40} /> },
  { id: 4, name: "Home", icon: <FaCouch size={40} /> },
  { id: 5, name: "Books", icon: <FaBook size={40} /> },
  { id: 6, name: "Gifts", icon: <FaGift size={40} /> },
  { id: 7, name: "More", icon: <FaLaptop size={40} /> },
  { id: 8, name: "Sports", icon: <FaTshirt size={40} /> },
  { id: 9, name: "Appliances", icon: <FaCouch size={40} /> },
  { id: 10, name: "Toys", icon: <FaGift size={40} /> },
  { id: 11, name: "Fitness", icon: <FaTshirt size={40} /> },
  { id: 12, name: "Furniture", icon: <FaCouch size={40} /> },
];

const Category = () => {
  const [showAll, setShowAll] = useState(false);

  const handleSeeMore = () => setShowAll((prev) => !prev);

  // For desktop -> always show 10 or all
  // For mobile -> default show 10 (5x2 rows), show all if "See More" clicked
  const visibleCategories = showAll ? categories : categories.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto md:py-2 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Top Category */}
        <h2 className="text-xl md:text-2xl font-semibold bg-blue-600 text-white px-5 py-1 rounded-md shadow">
          Top Category
        </h2>

        {/* Right: See More */}
        <button
          onClick={handleSeeMore}
          className="text-blue-600 pr-2 font-semibold text-lg hover:underline"
        >
          {showAll ? "Less all categories" : "See all categories"}
        </button>
      </div>

      {/* Category Grid */}
      <div
        className="
          grid 
          grid-cols-5            /* mobile: 5 per row */
          md:grid-cols-5         /* desktop: 10 per row */
          lg:grid-cols-10 
          gap-y-6
          place-items-center
          px-2
        "
      >
        {visibleCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center transition-all duration-300"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-blue-600 mb-2">
              {cat.icon}
            </div>
            <span className="text-sm md:text-base font-medium text-black text-center">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
