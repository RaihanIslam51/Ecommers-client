'use client';

import React from 'react';
import Image from 'next/image';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-light text-black tracking-wide">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images Section */}
            <div>
              <div className="relative h-80 bg-gray-50 overflow-hidden mb-6 border border-gray-200">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-20 h-20 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative h-20 bg-gray-50 overflow-hidden border border-gray-200">
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light text-black mb-3 tracking-wide">
                  {product.name}
                </h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-3xl font-light text-black">
                    ${product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-400 line-through font-light mt-1">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="border border-gray-300 text-black px-3 py-1 text-xs font-light">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Category</p>
                  <p className="font-light text-black">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Brand</p>
                  <p className="font-light text-black">{product.brand || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">SKU</p>
                  <p className="font-light text-black">{product.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Stock</p>
                  <p className={`font-light ${product.stock > 0 ? 'text-black' : 'text-gray-400'}`}>
                    {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                  </p>
                </div>
                {product.weight && (
                  <div>
                    <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Weight</p>
                    <p className="font-light text-black">{product.weight} kg</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Dimensions</p>
                    <p className="font-light text-black">{product.dimensions}</p>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Warranty</p>
                    <p className="font-light text-black">{product.warranty}</p>
                  </div>
                )}
                {product.returnPolicy && (
                  <div>
                    <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-1">Return Policy</p>
                    <p className="font-light text-black">{product.returnPolicy}</p>
                  </div>
                )}
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-light uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="border border-gray-200 text-gray-700 px-3 py-1 text-xs font-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 bg-white text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300 font-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
