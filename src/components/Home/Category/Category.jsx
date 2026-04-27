"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/context/DataCacheContext";

const Category = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);
  const searchParams = useSearchParams();
  const highlightCategory = searchParams.get('highlight');

  // Use prefetched + cached categories
  const { data: categoriesData, loading } = useCategories();
  const categories = categoriesData || [];

  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState);
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [categories, checkScrollState]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  // Scroll to highlighted category
  useEffect(() => {
    if (highlightCategory && categories.length > 0) {
      const highlighted = categories.find(cat => cat.name === highlightCategory);
      if (highlighted) {
        setTimeout(() => {
          const element = document.getElementById(`category-${highlighted._id || highlighted.name}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }, 400);
      }
    }
  }, [highlightCategory, categories]);

  if (loading) {
    return (
      <section className="w-full bg-white border-b border-[#e8e6e0]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex gap-4 sm:gap-6 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-3 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-[#e8e6e0] to-[#ddd9ce] animate-pulse flex-shrink-0 rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-[#e8e6e0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="relative flex items-center">

          {/* Left fade + arrow */}
          <div className={`absolute left-0 z-10 flex items-center h-full transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute left-0 w-8 sm:w-12 md:w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Scroll track */}
          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto scroll-smooth py-2 sm:py-3 md:py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, index) => {
              const isHighlighted = highlightCategory === cat.name;
              return (
                <Link
                  href={`/store?category=${encodeURIComponent(cat.name)}`}
                  id={`category-${cat._id || cat.name}`}
                  key={cat._id || `cat-${index}`}
                  aria-label={`Browse ${cat.name}`}
                  className={`group relative flex-shrink-0 px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-light sm:font-light uppercase tracking-[0.08em] sm:tracking-[0.1em] whitespace-nowrap transition-colors duration-200 ${
                    isHighlighted ? 'text-[#1a1a1a]' : 'text-[#888] hover:text-[#1a1a1a]'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {cat.name}
                  {/* Underline indicator */}
                  <span className={`absolute bottom-0 left-2 sm:left-3 md:left-4 lg:left-5 right-2 sm:right-3 md:right-4 lg:right-5 h-[1.5px] sm:h-[2px] bg-[#1a1a1a] transition-transform duration-200 origin-left ${
                    isHighlighted ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* Right fade + arrow */}
          <div className={`absolute right-0 z-10 flex items-center justify-end h-full transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute right-0 w-8 sm:w-12 md:w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#888] hover:text-[#1a1a1a] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Category;
