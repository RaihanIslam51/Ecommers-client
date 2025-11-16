"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
 
  FaChevronDown,
} from "react-icons/fa";
import axiosInstance from "@/lib/axios";



const Category = () => {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const searchParams = useSearchParams();
  const highlightCategory = searchParams.get('highlight');

  // Fetch categories from database
  const fetchCategories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      const response = await axiosInstance.get('/categories');
      // Server returns: { success: true, message: "...", categories: [...] }
      if (response.data && response.data.categories) {
        const newCategories = response.data.categories;
        setCategories(newCategories);
        if (isRefresh) {
          setJustUpdated(true);
          // Auto-expand if we have more than 12 categories to ensure new category is visible
          if (newCategories.length > 12) {
            setShowAll(true);
          }
          setTimeout(() => setJustUpdated(false), 2000);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories();

    // Listen for category added events from admin panel
    const handleCategoryAdded = (event) => {
      console.log('New category added, refreshing categories...');
      fetchCategories(true);
    };

    window.addEventListener('categoryAdded', handleCategoryAdded);

    // Cleanup event listener
    return () => {
      window.removeEventListener('categoryAdded', handleCategoryAdded);
    };
  }, []);

  const handleSeeMore = () => setShowAll((prev) => !prev);

  // Auto-expand and scroll to highlighted category
  useEffect(() => {
    if (highlightCategory && categories.length > 0) {
      const highlightedCat = categories.find(cat => cat.name === highlightCategory);
      if (highlightedCat) {
        // Auto-expand if highlighted category is beyond the default visible count
        const categoryIndex = categories.findIndex(cat => cat.name === highlightCategory);
        if (categoryIndex >= 12) {
          setShowAll(true);
        }
        
        // Scroll to highlighted category after a short delay
        setTimeout(() => {
          const element = document.getElementById(`category-${highlightedCat._id || highlightedCat.name}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'center' 
            });
          }
        }, 500);
      }
    }
  }, [highlightCategory, categories]);

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 py-16 md:py-20">No categories available</p>
        </div>
      </section>
    );
  }

  // Default visible: show 12 categories
  const visibleCategories = showAll ? categories : categories.slice(0, 12);

  return (
    <section className="w-full bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 md:mb-12 lg:mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="w-1.5 h-12 md:h-14 bg-linear-to-b from-green-500 to-emerald-600 rounded-full shadow-lg"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  Fresh Categories
                  {refreshing && (
                    <span className="ml-4 inline-block w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                  )}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1 w-12 bg-linear-to-r from-green-400 to-emerald-400 rounded-full"></div>
                  <div className="h-1 w-8 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                  <div className="h-1 w-4 bg-linear-to-r from-teal-400 to-cyan-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600 ml-6 lg:ml-7 leading-relaxed">
              Explore our fresh vegetables, meal kits, and healthy food categories
              {refreshing && <span className="text-green-600 font-semibold ml-2">• Updating...</span>}
              {justUpdated && <span className="text-emerald-600 font-semibold ml-2">• ✓ Categories updated!</span>}
            </p>
          </div>

          {/* See All Button */}
          <button
            onClick={handleSeeMore}
            aria-expanded={showAll}
            className="group relative inline-flex items-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            {/* Button background effect */}
            <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <span className="relative z-10 tracking-wide">{showAll ? "Show Less" : "View All Categories"}</span>
            <FaChevronDown
              className={`relative z-10 transition-all duration-500 transform group-hover:scale-110 ${
                showAll ? "rotate-180" : "rotate-0"
              }`}
              size={18}
            />
            
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
          {visibleCategories.map((cat, index) => {
            // const categoryIcon = iconMap[cat.icon] || iconMap["📦"];
            const isHighlighted = highlightCategory === cat.name;
            
            return (
              <Link
                href={`/store?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat._id || cat.name}`}
                key={cat._id || `cat-${index}`}
                role="button"
                tabIndex={0}
                className={`group relative bg-white hover:bg-linear-to-br hover:from-green-50 hover:to-emerald-50 border-2 rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-7 cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 overflow-hidden ${
                  isHighlighted 
                    ? 'border-blue-400 bg-linear-to-br from-blue-50 to-indigo-50 shadow-xl ring-2 ring-blue-200 scale-105' 
                    : 'border-gray-200 hover:border-green-400'
                }`}
                aria-label={`Browse ${cat.name} category`}
              >
                {/* Category Content */}
                <div className="flex flex-col items-center justify-center gap-3 md:gap-4 text-center min-h-20 md:min-h-24 lg:min-h-28">
                  {/* Category Name */}
                  <div className="relative">
                    <span className={`text-lg md:text-xl lg:text-2xl font-black transition-all duration-500 leading-tight tracking-wide ${
                      isHighlighted 
                        ? 'bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm' 
                        : 'text-gray-900 group-hover:bg-linear-to-r group-hover:from-green-600 group-hover:via-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent'
                    }`}>
                      {cat.name}
                    </span>
                    
                    {/* Decorative underline */}
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-500 rounded-full ${
                      isHighlighted 
                        ? 'w-3/4 bg-linear-to-r from-blue-400 to-purple-400' 
                        : 'w-0 group-hover:w-3/4 bg-linear-to-r from-green-400 to-emerald-400'
                    }`}></div>
                    
                    {/* Highlight star */}
                    {isHighlighted && (
                      <div className="absolute -top-1 -right-1 animate-pulse">
                        <span className="text-yellow-400 text-lg drop-shadow-sm">✨</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Count */}
                  {cat.productCount > 0 && (
                    <div className="relative">
                      <span className={`text-xs md:text-sm font-semibold px-2 py-1 rounded-full transition-all duration-300 ${
                        isHighlighted 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-700 group-hover:border-green-200 border border-gray-200'
                      }`}>
                        {cat.productCount} items
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Arrow Indicator */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-green-600"
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
                </div>

                {/* Decorative Elements */}
                <div className={`absolute inset-0 rounded-2xl md:rounded-3xl transition-all duration-500 -z-10 ${
                  isHighlighted 
                    ? 'bg-linear-to-br from-blue-100/80 to-indigo-200/80 opacity-100 shadow-inner' 
                    : 'bg-linear-to-br from-transparent via-green-50/50 to-emerald-100/50 opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Corner decorations */}
                <div className={`absolute top-3 left-3 w-2 h-2 rounded-full transition-all duration-500 ${
                  isHighlighted 
                    ? 'bg-blue-400 opacity-100' 
                    : 'bg-green-400 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className={`absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full transition-all duration-500 delay-100 ${
                  isHighlighted 
                    ? 'bg-indigo-400 opacity-100' 
                    : 'bg-emerald-400 opacity-0 group-hover:opacity-100'
                }`}></div>
                
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-size-[20px_20px]"></div>
                </div>
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
