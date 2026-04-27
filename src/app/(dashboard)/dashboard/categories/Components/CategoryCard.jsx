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
    <div className={`group bg-white border overflow-hidden hover:border-black transition-colors duration-300 ${
      isSelected ? 'border-black ring-1 ring-black' : 'border-gray-200'
    }`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 border-gray-300 text-black cursor-pointer"
          />
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 bg-white overflow-hidden">
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
          <span className={`px-3 py-1 text-xs font-light uppercase tracking-widest border backdrop-blur-sm ${
            status === 'active' 
              ? 'bg-white text-black border-black' 
              : 'bg-white text-gray-600 border-gray-200'
          }`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Product Count Badge */}
        {!onSelect && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-light uppercase tracking-widest bg-black text-white backdrop-blur-sm border border-black">
              {productCount || 0} Products
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-lg font-light text-black mb-2 line-clamp-1 tracking-wide">
          {name}
        </h3>
        <p className="text-sm text-gray-600 font-light line-clamp-2 min-h-10">
          {description || 'No description available'}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2">
          <button
            onClick={() => onView(category)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-light text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={() => onEdit(category)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-light text-sm"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="px-3 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all duration-200 font-light"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
