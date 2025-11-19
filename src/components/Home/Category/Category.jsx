"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

const Category = () => {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const highlightCategory = searchParams.get('highlight');

  // Fetch categories from database
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/categories');
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSeeMore = () => setShowAll((prev) => !prev);

  // Auto-expand and scroll to highlighted category
  useEffect(() => {
    if (highlightCategory && categories.length > 0) {
      const highlightedCat = categories.find(cat => cat.name === highlightCategory);
      if (highlightedCat) {
        const categoryIndex = categories.findIndex(cat => cat.name === highlightCategory);
        if (isMobile && categoryIndex >= 12) {
          setShowAll(true);
        }
        
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
  }, [highlightCategory, categories, isMobile]);

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16 md:py-20">
            <div className="text-gray-600">Loading categories...</div>
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

  // Default visible: show 12 categories on mobile, all on desktop
  const visibleCategories = isMobile ? (showAll ? categories : categories.slice(0, 12)) : categories;

  return (
    <section className="w-full bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 md:mb-12 lg:mb-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Fresh Categories
            </h2>
            <p className="text-base md:text-lg text-gray-600 mt-2">
              Explore our fresh vegetables, meal kits, and healthy food categories
            </p>
          </div>

          {/* See All Button - only on mobile */}
          {isMobile && categories.length > 12 && (
            <button
              onClick={handleSeeMore}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              {showAll ? "Show Less" : "View All Categories"}
            </button>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 lg:gap-5">
          {visibleCategories.map((cat, index) => {
            const isHighlighted = highlightCategory === cat.name;
            
            return (
              <Link
                href={`/store?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat._id || cat.name}`}
                key={cat._id || `cat-${index}`}
                className={`bg-white hover:bg-gray-50 border  rounded-lg p-4 text-center ${
                  isHighlighted ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-green-400'
                }`}
                aria-label={`Browse ${cat.name} category`}
              >
                <div className="text-sm font-semibold text-gray-900">
                  {cat.name}
                  {cat.productCount > 0 && (
                    <span className="text-gray-500 ml-1">({cat.productCount})</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Info - only on mobile */}
        {isMobile && !showAll && categories.length > 12 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {visibleCategories.length} of {categories.length} categories
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
