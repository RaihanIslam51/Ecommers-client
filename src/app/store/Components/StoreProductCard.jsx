'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';
import Swal from 'sweetalert2';

const ProductCard = ({ product, viewType = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // Handle different product data structures
  const productId = product._id || product.id;
  const productImage = product.image || 'https://via.placeholder.com/300';
  const productName = product.name || 'Product Name';
  const productDescription = product.description || product.feature || '';
  const actualPrice = product.originalPrice || product.price || 0;
  const discountPrice = product.price || 0;
  const stock = product.stock || 0;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 0;
  const badge = product.badge || (actualPrice > discountPrice ? 'Sale' : null);
  const isFavorite = isInWishlist(productId);

  const calculateDiscount = () => {
    if (actualPrice && discountPrice && actualPrice > discountPrice) {
      return Math.round(((actualPrice - discountPrice) / actualPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${productName} has been added to your cart`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromWishlist(productId);
      Swal.fire({
        icon: 'info',
        title: 'Removed from Wishlist',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      addToWishlist(product);
      Swal.fire({
        icon: 'success',
        title: 'Added to Wishlist!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  if (viewType === 'list') {
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <Link href={`/products/${productId}`} className="relative w-full sm:w-64 h-64 sm:h-auto flex-shrink-0">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {badge && (
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  {badge}
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
            </button>
          </Link>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Title & Description */}
              <Link href={`/products/${productId}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                  {productName}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{productDescription}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating} ({reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-black">${discountPrice}</span>
                {actualPrice > discountPrice && (
                  <span className="text-lg text-gray-400 line-through">${actualPrice}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                    <BsLightningFill className="text-xs" />
                    {stock} in stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaEye className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <Link href={`/products/${productId}`} className="relative aspect-square overflow-hidden block">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {badge && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
              {badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all z-10 hover:scale-110"
        >
          <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
        </button>

        {/* Quick Actions - Show on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
            <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
              <FaEye className="text-black" />
            </button>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/products/${productId}`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 cursor-pointer min-h-[40px]">
            {productName}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 min-h-[32px]">
          {productDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-xs ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-black">${discountPrice}</span>
          {actualPrice > discountPrice && (
            <span className="text-sm text-gray-400 line-through">${actualPrice}</span>
          )}
        </div>

        {/* Stock */}
        <div className="pt-3 border-t border-gray-100">
          {stock > 0 ? (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <BsLightningFill className="text-xs" />
              {stock} in stock
            </span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
