'use client';
import React from 'react';
import { FiX } from 'react-icons/fi';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getActiveFilters = () => {
    const active = [];

    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(cat => {
        active.push({ type: 'category', value: cat, label: cat });
      });
    }

    if (filters.brands && filters.brands.length > 0) {
      filters.brands.forEach(brand => {
        active.push({ type: 'brand', value: brand, label: brand });
      });
    }

    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      const label = max === Infinity ? `Over $${min}` : `$${min} - $${max}`;
      active.push({ type: 'priceRange', value: 'priceRange', label });
    }

    if (filters.customPriceRange?.min || filters.customPriceRange?.max) {
      const { min, max } = filters.customPriceRange;
      const label = `$${min || 0} - $${max || '∞'}`;
      active.push({ type: 'customPriceRange', value: 'customPriceRange', label });
    }

    if (filters.productTypes && filters.productTypes.length > 0) {
      filters.productTypes.forEach(type => {
        active.push({ type: 'productType', value: type, label: type });
      });
    }

    if (filters.availability && filters.availability.length > 0) {
      filters.availability.forEach(avail => {
        active.push({ type: 'availability', value: avail, label: avail });
      });
    }

    if (filters.ratings && filters.ratings.length > 0) {
      filters.ratings.forEach(rating => {
        active.push({ type: 'rating', value: rating, label: `${rating}★ & Up` });
      });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Active Filters:</span>
        
        {activeFilters.map((filter, index) => (
          <span
            key={`${filter.type}-${filter.value}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
          >
            {filter.label}
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
            >
              <FiX className="text-gray-500 hover:text-gray-700" />
            </button>
          </span>
        ))}

        {activeFilters.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
