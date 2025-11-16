'use client';

import React from 'react';
import Image from 'next/image';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          {product.stock > 0 ? (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-green-600">
              ${product.price}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(product)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
