"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { log } from 'firebase/firestore/pipelines';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };
 
  
  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-5xl text-gray-300 mb-8">♡</div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-5xl text-gray-300 mb-8">♡</div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 text-base mb-12 text-center max-w-md font-light leading-relaxed">
              Save items you love and revisit them whenever inspiration strikes
            </p>
            <Link
              href="/store"
              className="px-8 py-3 bg-gray-400 text-white text-sm font-light tracking-wide hover:bg-gray-500 transition-colors duration-300"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="w-full container mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 text-sm font-light"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back</span>
          </Link>
          <div>
            <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm font-light">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 mb-24">
          {wishlistItems.map((product) => {
            const pid = product._id || product.id;
            const discountPercent =
              product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <div key={pid} className="group flex flex-col">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gray-50 overflow-hidden mb-6 cursor-pointer">
                  <Image
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    quality={85}
                  />
                 
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-xs font-light tracking-wider">
                      −{discountPercent}%
                    </div>
                  )}
                    
                  {/* Out of Stock */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <span className="text-xs font-light text-gray-600 tracking-widest uppercase">
                        Unavailable
                      </span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(pid);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                    title="Remove from wishlist"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-4 flex-1">
                  {/* Product Name & Price */}
                  <div className="flex flex-col gap-2">
                    <h3
                      onClick={() => window.location.href = `/products/${pid}`}
                      className="text-sm font-light text-gray-900 line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors leading-relaxed"
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-light text-gray-900">
                        ${product.price?.toLocaleString()}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-xs text-gray-400 line-through font-light">
                          ${product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className={`w-full py-3 text-xs font-light tracking-widest border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 mt-auto ${
                      product.stock === 0 ? 'opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-900' : ''
                    }`}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-gray-200 pt-16 text-center">
          <h3 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
            Continue shopping
          </h3>
          <p className="text-gray-500 text-sm font-light mb-8">
            Discover new arrivals and exclusive items
          </p>
          <Link
            href="/store"
            className="inline-block px-8 py-3 bg-gray-400 text-white text-xs font-light tracking-widest hover:bg-gray-500 transition-colors duration-300"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
