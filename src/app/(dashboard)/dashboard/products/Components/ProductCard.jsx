'use client';

import React from 'react';
import Image from 'next/image';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white p-6 border border-gray-200 hover:border-black transition-colors duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 w-full bg-gray-50 mb-6">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {product.stock > 0 ? (
            <span className="border border-gray-300 text-black text-xs px-3 py-1 bg-white font-light">
              In Stock
            </span>
          ) : (
            <span className="border border-gray-300 text-gray-500 text-xs px-3 py-1 bg-white font-light">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-light text-black truncate tracking-wide uppercase">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 font-light mt-1">{product.category}</p>
        </div>

        <p className="text-gray-600 text-xs mb-4 line-clamp-2 font-light leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-2xl font-light text-black">
              ${product.price}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through font-light mt-1">
                ${product.originalPrice}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 font-light">Stock: {product.stock}</p>
            <p className="text-xs text-gray-500 font-light mt-1">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(product)}
            className="flex-1 border border-gray-200 bg-white text-black px-3 py-2 text-xs font-light transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            View
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 border border-gray-200 bg-white text-black px-3 py-2 text-xs font-light transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 border border-gray-200 bg-white text-gray-600 px-3 py-2 text-xs font-light transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
