import React from 'react';
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react';

/**
 * Category Filters Component - Search, filter and view mode controls
 */
const CategoryFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="bg-white border border-gray-200 hover:border-black p-8 transition-colors">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
        >
          <option value="name">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="products">Most Products</option>
          <option value="products-asc">Least Products</option>
          <option value="recent">Recently Added</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border border-gray-200 p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 transition-all ${
              viewMode === 'grid' 
                ? 'bg-black text-white border border-black' 
                : 'text-gray-600 border border-transparent hover:text-black'
            }`}
            title="Grid View"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 transition-all ${
              viewMode === 'list' 
                ? 'bg-black text-white border border-black' 
                : 'text-gray-600 border border-transparent hover:text-black'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
