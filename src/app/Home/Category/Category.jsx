"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaCouch,
  FaBook,
  FaGift,
  FaChevronDown,
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";

// Icon mapping for categories
const iconMap = {
  "📱": <FaMobileAlt size={40} />,
  "💻": <FaLaptop size={40} />,
  "👕": <FaTshirt size={40} />,
  "🏠": <FaCouch size={40} />,
  "📚": <FaBook size={40} />,
  "🎁": <FaGift size={40} />,
  "📦": <FaLaptop size={40} />, // Default
};

const Category = () => {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        // Server returns: { success: true, message: "...", categories: [...] }
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSeeMore = () => setShowAll((prev) => !prev);

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16 md:py-20">
            <div className="animate-spin h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 py-16 md:py-20">No categories available</p>
        </div>
      </section>
    );
  }

  // Default visible: show 12 categories
  const visibleCategories = showAll ? categories : categories.slice(0, 12);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 lg:mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 md:h-10 bg-gray-900 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">
                Top Categories
              </h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 ml-4 lg:ml-5">
              Browse popular categories across our global marketplace
            </p>
          </div>

          {/* See All Button */}
          <button
            onClick={handleSeeMore}
            aria-expanded={showAll}
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
          {visibleCategories.map((cat, index) => {
            const categoryIcon = iconMap[cat.icon] || iconMap["📦"];
            
            return (
              <Link
                href={`/store?category=${encodeURIComponent(cat.name)}`}
                key={cat._id || `cat-${index}`}
                role="button"
                tabIndex={0}
                className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-900 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                aria-label={`Browse ${cat.name} category`}
              >
                {/* Icon Container */}
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-xl md:rounded-2xl bg-gray-100 group-hover:bg-gray-900 transition-all duration-300 shadow-md group-hover:shadow-xl">
                    <div className="text-gray-700 group-hover:text-white transition-colors duration-300 text-2xl md:text-3xl">
                      {cat.icon}
                    </div>
                  </div>

                  {/* Category Name */}
                  <span className="text-xs md:text-sm lg:text-base font-bold text-gray-900 text-center group-hover:text-gray-900 transition-colors">
                    {cat.name}
                  </span>
                  
                  {/* Product Count */}
                  {cat.productCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {cat.productCount} products
                    </span>
                  )}
                </div>

                {/* Hover Arrow Indicator */}
                <div className="absolute top-2 md:top-3 right-2 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-900"
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
              </Link>
            );
          })}
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
