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
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Active:</span>
        
        {activeFilters.map((filter, index) => (
          <span
            key={`${filter.type}-${filter.value}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 border border-gray-300 text-xs text-black font-medium"
          >
            {filter.label}
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="hover:text-gray-500 transition-colors p-0.5"
            >
              <FiX className="text-xs" />
            </button>
          </span>
        ))}

        {activeFilters.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors ml-1"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
