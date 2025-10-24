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

  // Default visible on mobile: show 8 (2 rows of 4)
  // On larger screens the grid expands responsively; clicking "See all" shows the full list
  const visibleCategories = showAll ? categories : categories.slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto md:py-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Top Categories
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse popular categories across our global catalog
          </p>
        </div>

        {/* Right: See More */}
        <button
          onClick={handleSeeMore}
          aria-expanded={showAll}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span className="font-medium text-sm">
            {showAll ? "Show less" : "See all categories"}
          </span>
          <FaChevronDown
            className={"transition-transform " + (showAll ? "rotate-180" : "rotate-0")}
          />
        </button>
      </div>

  {/* Category Grid: mobile -> 4 columns (2 rows visible by default = 8 items) */}
  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-4">
        {visibleCategories.map((cat) => (
          <div
            key={cat.id}
            role="button"
            tabIndex={0}
            className="flex flex-col items-center gap-2 bg-white border border-slate-100 rounded-lg p-3 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white shadow-md">
              {React.cloneElement(cat.icon, { size: 24, className: "" })}
            </div>

            <span className="text-xs md:text-sm font-medium text-slate-800 text-center truncate w-full">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
