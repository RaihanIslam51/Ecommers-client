'use client';

import React from 'react';
import Image from 'next/image';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images Section */}
            <div>
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative h-20 bg-gray-100 rounded overflow-hidden">
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
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                  {product.originalPrice && (
                    <p className="text-lg text-gray-400 line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="font-semibold">{product.brand || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="font-semibold">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock</p>
                  <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                  </p>
                </div>
                {product.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{product.weight} kg</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-semibold">{product.dimensions}</p>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <p className="text-sm text-gray-600">Warranty</p>
                    <p className="font-semibold">{product.warranty}</p>
                  </div>
                )}
                {product.returnPolicy && (
                  <div>
                    <p className="text-sm text-gray-600">Return Policy</p>
                    <p className="font-semibold">{product.returnPolicy}</p>
                  </div>
                )}
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
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
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
