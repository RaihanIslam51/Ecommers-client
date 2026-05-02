'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { BsFilterLeft } from 'react-icons/bs';

// FilterSection component - moved outside to avoid recreation on render
const FilterSection = ({ title, sectionKey, expandedSections, toggleSection, children }) => (
  <div className="border-b border-gray-200 pb-2 mb-2 lg:pb-4 lg:mb-4">
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full py-1.5 lg:py-2 text-left"
    >
      <h3 className="text-xs lg:text-sm font-semibold text-gray-900 uppercase tracking-wide">
        {title}
      </h3>
      {expandedSections[sectionKey] ? (
        <FiChevronUp className="text-gray-500 text-sm" />
      ) : (
        <FiChevronDown className="text-gray-500 text-sm" />
      )}
    </button>
    {expandedSections[sectionKey] && (
      <div className="mt-1.5 lg:mt-3 space-y-1 lg:space-y-2">
        {children}
      </div>
    )}
  </div>
);

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  categories = [], 
  onClearAll,
  isMobileOpen,
  onCloseMobile 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    availability: false,
    rating: false,
    productType: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: 'Over $500', min: 500, max: Infinity }
  ];

  const productTypes = ['New Arrivals', 'Best Sellers', 'On Sale', 'Featured'];
  const availabilityOptions = ['In Stock', 'Out of Stock', 'Pre-Order'];

  return (
    <div className={`
      ${isMobileOpen ? 'fixed insert-0 left-0 right-0 h-1/2 z-50 bg-white overflow-y-auto animate-in slide-in-from-left duration-300' : 'hidden lg:block'}
      lg:sticky lg:top-4 lg:h-fit
    `}>
      {/* Mobile Header */}
      {isMobileOpen && (
        <div className="sticky top-0 bg-white border-b border-gray-200 p-2.5 lg:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <BsFilterLeft className="text-black text-base lg:text-lg" />
            <h2 className="text-xs lg:text-sm font-bold uppercase tracking-widest text-black">Filters</h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-base lg:text-lg text-black" />
          </button>
        </div>
      )}

      <div className="p-2.5 lg:p-0">
        <div className="flex items-center justify-between mb-2 lg:mb-6">

          
          <button
            onClick={onClearAll}
            className="text-[10px] lg:text-xs pt-2 lg:pt-4 font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <FilterSection 
          title="Category" 
          sectionKey="category"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-1 lg:space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category._id || category.name}
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 lg:p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.name) || false}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...(filters.categories || []), category.name]
                      : (filters.categories || []).filter(c => c !== category.name);
                    onFilterChange({ categories: newCategories });
                  }}
                  className="w-3.5 lg:w-4 h-3.5 lg:h-4 accent-black border-gray-300 rounded"
                />
                <span className="text-xs lg:text-sm text-gray-700 flex items-center gap-1 lg:gap-2">
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                  {category.productCount > 0 && (
                    <span className="text-xs text-gray-500">({category.productCount})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection 
          title="Price Range" 
          sectionKey="price"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-1 lg:space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 lg:p-2 rounded"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                  }
                  onChange={() => {
                    onFilterChange({
                      priceRange: { min: range.min, max: range.max }
                    });
                  }}
                  className="w-3.5 lg:w-4 h-3.5 lg:h-4 accent-black border-gray-300"
                />
                <span className="text-xs lg:text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
          {/* Custom Price Range */}
          <div className="mt-2 lg:mt-4 pt-2 lg:pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1.5 lg:gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.customPriceRange?.min || ''}
                onChange={(e) => {
                  onFilterChange({
                    customPriceRange: {
                      min: Number(e.target.value),
                      max: filters.customPriceRange?.max || 0
                    }
                  });
                }}
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-200 text-xs lg:text-sm focus:border-black focus:outline-none transition-colors bg-gray-50 text-black"
              />
              <span className="text-gray-500 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.customPriceRange?.max || ''}
                onChange={(e) => {
                  onFilterChange({
                    customPriceRange: {
                      min: filters.customPriceRange?.min || 0,
                      max: Number(e.target.value)
                    }
                  });
                }}
                className="w-full px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-200 text-xs lg:text-sm focus:border-black focus:outline-none transition-colors bg-gray-50 text-black"
              />
            </div>
          </div>
        </FilterSection>

        {/* Product Type Filter */}
        <FilterSection 
          title="Product Type" 
          sectionKey="productType"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-1 lg:space-y-2">
            {productTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 lg:p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.productTypes?.includes(type) || false}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...(filters.productTypes || []), type]
                      : (filters.productTypes || []).filter(t => t !== type);
                    onFilterChange({ productTypes: newTypes });
                  }}
                  className="w-3.5 lg:w-4 h-3.5 lg:h-4 accent-black border-gray-300 rounded"
                />
                <span className="text-xs lg:text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability Filter */}
        <FilterSection 
          title="Availability" 
          sectionKey="availability"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-1 lg:space-y-2">
            {availabilityOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 lg:p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.availability?.includes(option) || false}
                  onChange={(e) => {
                    const newAvailability = e.target.checked
                      ? [...(filters.availability || []), option]
                      : (filters.availability || []).filter(a => a !== option);
                    onFilterChange({ availability: newAvailability });
                  }}
                  className="w-3.5 lg:w-4 h-3.5 lg:h-4 accent-black border-gray-300 rounded"
                />
                <span className="text-xs lg:text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Customer Rating Filter */}
        <FilterSection 
          title="Customer Rating" 
          sectionKey="rating"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-1 lg:space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 lg:p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.ratings?.includes(rating) || false}
                  onChange={(e) => {
                    const newRatings = e.target.checked
                      ? [...(filters.ratings || []), rating]
                      : (filters.ratings || []).filter(r => r !== rating);
                    onFilterChange({ ratings: newRatings });
                  }}
                  className="w-3.5 lg:w-4 h-3.5 lg:h-4 accent-black border-gray-300 rounded"
                />
                <span className="flex items-center gap-0.5 lg:gap-1 text-xs lg:text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-[0.5rem] lg:text-xs ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-gray-700 ml-1">& Up</span>
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Mobile Apply Button */}
      {isMobileOpen && (
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-2.5 lg:p-4">
          <button
            onClick={onCloseMobile}
            className="w-full bg-black text-white py-2 lg:py-3 font-semibold text-xs lg:text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
