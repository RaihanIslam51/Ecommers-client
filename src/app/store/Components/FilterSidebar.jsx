'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

// FilterSection component - moved outside to avoid recreation on render
const FilterSection = ({ title, sectionKey, expandedSections, toggleSection, children }) => (
  <div className="border-b border-gray-200 pb-4 mb-4">
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full py-2 text-left"
    >
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
        {title}
      </h3>
      {expandedSections[sectionKey] ? (
        <FiChevronUp className="text-gray-500" />
      ) : (
        <FiChevronDown className="text-gray-500" />
      )}
    </button>
    {expandedSections[sectionKey] && (
      <div className="mt-3 space-y-2">
        {children}
      </div>
    )}
  </div>
);

const FilterSidebar = ({ 
  filters, 
  onFilterChange, 
  categories = [], 
  brands = [],
  onClearAll,
  isMobileOpen,
  onCloseMobile 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    availability: true,
    rating: true,
    productType: true
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
      ${isMobileOpen ? 'fixed inset-0 z-50 bg-white overflow-y-auto' : 'hidden lg:block'}
      lg:sticky lg:top-4 lg:h-fit
    `}>
      {/* Mobile Header */}
      {isMobileOpen && (
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={onCloseMobile}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      )}

      <div className="p-4 lg:p-0">
        {/* Clear All Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 hidden lg:block">Filters</h2>
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category._id || category.name}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700 flex items-center gap-2">
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

        {/* Brand Filter */}
        <FilterSection 
          title="Brand" 
          sectionKey="brand"
          expandedSections={expandedSections}
          toggleSection={toggleSection}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...(filters.brands || []), brand]
                      : (filters.brands || []).filter(b => b !== brand);
                    onFilterChange({ brands: newBrands });
                  }}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700">{brand}</span>
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
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
          {/* Custom Price Range */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
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
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
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
          <div className="space-y-2">
            {productTypes.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700">{type}</span>
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
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700">{option}</span>
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
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
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
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="flex items-center gap-1 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-xs ${
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
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onCloseMobile}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
