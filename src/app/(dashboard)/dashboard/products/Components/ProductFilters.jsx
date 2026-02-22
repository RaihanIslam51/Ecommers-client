'use client';

import React from 'react';

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white text-black rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-black hover:text-gray-700 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Status
          </label>
          <select
            name="stockStatus"
            value={filters.stockStatus || ''}
            onChange={(e) => onFilterChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="">All</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
            <option value="lowStock">Low Stock (&lt; 10)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            name="sortBy"
            value={filters.sortBy || ''}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
