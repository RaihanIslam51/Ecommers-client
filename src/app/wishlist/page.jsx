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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-linear-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-green-500 text-5xl" />
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
    <div className="min-h-screen bg-gray-50 pt-2 pb-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {wishlistItems.map((product) => {
            const pid = product._id || product.id;
            const discountPercent =
              product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <div
                key={pid}
                className="relative group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => window.location.href = `/products/${pid}`}
                style={{ height: '320px' }}
              >
                {/* IMAGE (75%) */}
                <div className="relative w-full" style={{ flex: '0 0 75%' }}>
                  <Image
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(pid);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow border border-gray-200 hover:bg-green-50 transition-colors z-20"
                    title="Remove from wishlist"
                  >
                    <FaTrash className="text-red-500 text-xs" />
                  </button>

                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* Out of stock overlay */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* INFO (25%) */}
                <div className="flex flex-col justify-center px-3 py-2 gap-1" style={{ flex: '0 0 25%' }}>
                  <p className="text-xs font-semibold text-black line-clamp-1 leading-tight">
                    {product.name}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-black">
                      ${product.price?.toLocaleString()}
                    </span>
                    {discountPercent > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="ml-auto text-xs font-semibold text-red-500">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className={`flex-1 py-1 text-xs font-semibold text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Move to Cart
                  </button>
                </div>
              </div>
            );
          })}
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
