"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);
  const searchParams = useSearchParams();
  const highlightCategory = searchParams.get('highlight');

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
      <section className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-8 overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-3 w-16 bg-gray-100 animate-pulse flex-shrink-0 rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">

          {/* Left fade + arrow */}
          <div className={`absolute left-0 z-10 flex items-center h-full transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute left-0 w-16 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="relative z-10 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Scroll track */}
          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto scroll-smooth"
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
                  className={`group relative flex-shrink-0 px-4 py-4 text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-colors duration-200 ${
                    isHighlighted ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {cat.name}
                  {/* Underline indicator */}
                  <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-black transition-transform duration-200 origin-left ${
                    isHighlighted ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              );
            })}
          </div>

          {/* Right fade + arrow */}
          <div className={`absolute right-0 z-10 flex items-center justify-end h-full transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute right-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="relative z-10 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
