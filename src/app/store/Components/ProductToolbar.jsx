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
  onFilterToggle 
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
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section - Product Count & Filter Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={onFilterToggle}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BsFilterLeft className="text-xl" />
              <span className="text-sm font-medium">Filters</span>
            </button>

            {/* Product Count */}
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{totalProducts}</span> Products Found
            </div>
          </div>

          {/* Right Section - View Toggle & Sort */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 hidden sm:block">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer"
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
                className={`p-2 rounded transition-colors ${
                  currentView === 'grid'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <FiGrid className="text-lg" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 rounded transition-colors ${
                  currentView === 'list'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
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
