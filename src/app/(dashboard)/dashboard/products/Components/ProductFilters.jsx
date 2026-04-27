'use client';

import React from 'react';

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white text-black p-8 mb-8 border border-gray-200 hover:border-black transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-light text-black tracking-wide">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-black font-light tracking-widest uppercase transition-colors"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-200 focus:border-black focus:outline-none text-sm font-light transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
            Category
          </label>
          <select
            name="category"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 focus:border-black focus:outline-none text-sm font-light transition-colors"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Books">Books</option>
            <option value="Toys">Toys</option>
            <option value="Beauty">Beauty</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
            Stock Status
          </label>
          <select
            name="stockStatus"
            value={filters.stockStatus || ''}
            onChange={(e) => onFilterChange('stockStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 focus:border-black focus:outline-none text-sm font-light transition-colors"
          >
            <option value="">All</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="lowStock">Low Stock (&lt; 10)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
            Sort By
          </label>
          <select
            name="sortBy"
            value={filters.sortBy || ''}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 focus:border-black focus:outline-none text-sm font-light transition-colors"
          >
            <option value="">Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
