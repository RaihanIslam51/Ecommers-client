"use client";
import React, { useState } from "react";
import {
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaCouch,
  FaBook,
  FaGift,
  FaChevronDown,
} from "react-icons/fa";

const categories = [
  { id: 1, name: "Electronics", icon: <FaLaptop size={40} />, color: "blue" },
  { id: 2, name: "Mobiles", icon: <FaMobileAlt size={40} />, color: "purple" },
  { id: 3, name: "Fashion", icon: <FaTshirt size={40} />, color: "pink" },
  { id: 4, name: "Home", icon: <FaCouch size={40} />, color: "green" },
  { id: 5, name: "Books", icon: <FaBook size={40} />, color: "orange" },
  { id: 6, name: "Gifts", icon: <FaGift size={40} />, color: "red" },
  { id: 7, name: "More", icon: <FaLaptop size={40} />, color: "blue" },
  { id: 8, name: "Sports", icon: <FaTshirt size={40} />, color: "teal" },
  { id: 9, name: "Appliances", icon: <FaCouch size={40} />, color: "indigo" },
  { id: 10, name: "Toys", icon: <FaGift size={40} />, color: "yellow" },
  { id: 11, name: "Fitness", icon: <FaTshirt size={40} />, color: "cyan" },
  { id: 12, name: "Furniture", icon: <FaCouch size={40} />, color: "emerald" },
  { id: 13, name: "More", icon: <FaLaptop size={40} />, color: "violet" },
  { id: 14, name: "Sports", icon: <FaTshirt size={40} />, color: "lime" },
  { id: 15, name: "Appliances", icon: <FaCouch size={40} />, color: "amber" },
  { id: 16, name: "Toys", icon: <FaGift size={40} />, color: "rose" },
  { id: 17, name: "Fitness", icon: <FaTshirt size={40} />, color: "sky" },
  { id: 18, name: "Furniture", icon: <FaCouch size={40} />, color: "slate" },
];

const Category = () => {
  const [showAll, setShowAll] = useState(false);

  const handleSeeMore = () => setShowAll((prev) => !prev);

  // Default visible: show 12 categories
  const visibleCategories = showAll ? categories : categories.slice(0, 12);

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gray-900 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
                Top Categories
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 ml-4">
              Browse popular categories across our global marketplace
            </p>
          </div>

          {/* See All Button */}
          <button
            onClick={handleSeeMore}
            aria-expanded={showAll}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>{showAll ? "Show Less" : "View All Categories"}</span>
            <FaChevronDown
              className={`transition-transform duration-300 ${
                showAll ? "rotate-180" : "rotate-0"
              }`}
              size={14}
            />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {visibleCategories.map((cat, index) => (
            <div
              key={`${cat.id}-${index}`}
              role="button"
              tabIndex={0}
              className="group relative bg-white hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-900 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              aria-label={`Browse ${cat.name} category`}
            >
              {/* Icon Container */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-gray-100 group-hover:bg-gray-900 transition-all duration-300 shadow-md group-hover:shadow-xl">
                  <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(cat.icon, {
                      size: 28,
                      className: "md:w-8 md:h-8",
                    })}
                  </div>
                </div>

                {/* Category Name */}
                <span className="text-sm md:text-base font-bold text-gray-900 text-center group-hover:text-gray-900 transition-colors">
                  {cat.name}
                </span>
              </div>

              {/* Hover Arrow Indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-5 h-5 text-gray-900"
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

              {/* Decorative Element */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        {!showAll && categories.length > 12 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {visibleCategories.length} of {categories.length}{" "}
              categories
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
