"use client";
import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, addToCart, isInWishlist } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optionally show a success message
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-red-400 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-lg mb-8 text-center max-w-md">
              Start adding products you love to your wishlist and keep track of items you want to buy later.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <AiOutlineShoppingCart className="text-xl" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-500">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-red-500">
              <FaHeart className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFromWishlist(product._id);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all duration-200 z-10"
                  title="Remove from wishlist"
                >
                  <FaTrash className="text-red-500 text-sm" />
                </button>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{product.discount}%
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Category */}
                {product.category && (
                  <p className="text-xs text-gray-500 mb-3">
                    {product.category}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-black text-gray-900">
                    ৳{product.price?.toLocaleString()}
                  </span>
                  {product.discount > 0 && product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <FaShoppingCart />
                    Move to Cart
                  </button>
                </div>

                {/* Stock Status */}
                {product.stock > 0 && product.stock <= 10 && (
                  <p className="text-xs text-orange-600 font-semibold mt-2 text-center">
                    Only {product.stock} left in stock!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Shop?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse more products and find amazing deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <AiOutlineShoppingCart className="text-xl" />
              Continue Shopping
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-all duration-200 font-semibold"
            >
              <FaShoppingCart />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
