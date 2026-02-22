import React from 'react';

import { Pencil, Trash2, Eye, Package } from 'lucide-react';
import Image from 'next/image';

/**
 * Category Card Component - Displays individual category with image and details
 */
const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  onView,
  isSelected,
  onSelect
}) => {
  const { name, description, image, productCount, status, color } = category;

  return (
    <div className={`group bg-white rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
          />
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        {image ? (
          <Image
            src={image} 
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: color || '#f3f4f6' }}
          >
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            status === 'active' 
              ? 'bg-green-100/90 text-green-700 border border-green-200' 
              : 'bg-gray-100/90 text-gray-600 border border-gray-200'
          }`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Product Count Badge */}
        {!onSelect && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-sm border border-blue-400">
              {productCount || 0} Products
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-10">
          {description || 'No description available'}
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onView(category)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-black rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>
          <button
            onClick={() => onEdit(category)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-black rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <Pencil className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
