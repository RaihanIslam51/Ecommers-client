'use client';
import React from 'react';
import { FiGrid, FiList } from 'react-icons/fi';
import { BsFilterLeft } from 'react-icons/bs';

const ProductToolbar = ({ 
  totalProducts, 
  currentView, 
  onViewChange, 
  sortBy, 
  onSortChange,
  onFilterToggle,
  filters = {}
}) => {
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'name-a-z', label: 'Name: A to Z' },
    { value: 'name-z-a', label: 'Name: Z to A' },
    { value: 'rating', label: 'Customer Rating' }
  ];

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className=" sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Left Section - Product Count & Filter Button */}
          <div className="flex items-center pr-0 justify-between sm:justify-start gap-4">
            {/* Mobile Filter Toggle - Enhanced */}
            <button
              onClick={onFilterToggle}
              className="lg:hidden flex items-center mt-3  gap-2 px-3 py-1.5 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-900 transition-colors"
            >
              <BsFilterLeft className=" text-base" />
              <span>Filters</span>
              {(filters.categories?.length > 0 || filters.priceRange || filters.customPriceRange || filters.productTypes?.length > 0 || filters.availability?.length > 0 || filters.ratings?.length > 0) && (
                <span className="bg-white text-black text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {[
                    filters.categories?.length || 0,
                    filters.priceRange ? 1 : 0,
                    filters.customPriceRange ? 1 : 0,
                    filters.productTypes?.length || 0,
                    filters.availability?.length || 0,
                    filters.ratings?.length || 0
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {/* Product Count */}
           <div className="text-sm sm:text-base pt-4 sm:pt-0 text-gray-600">
  <span className="font-semibold text-gray-900">{totalProducts}</span> Products Found
</div>
          </div>

          {/* Right Section - View Toggle & Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {/* Sort Dropdown - Desktop Only */}
            <div className="hidden md:flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-2 sm:px-3 py-2 border border-gray-200 text-sm focus:border-black focus:outline-none bg-white cursor-pointer min-w-0 text-black"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 transition-colors ${
                  currentView === 'grid'
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:text-black'
                }`}
                title="Grid View"
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 transition-colors ${
                  currentView === 'list'
                    ? 'bg-black text-white'
                    : 'text-gray-400 hover:text-black'
                }`}
                title="List View"
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
