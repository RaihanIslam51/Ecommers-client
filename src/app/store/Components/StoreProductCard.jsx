'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaStar, FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import { BsLightningFill } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';
import Swal from 'sweetalert2';

const ProductCard = ({ product, viewType = 'grid' }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // Handle different product data structures
  const productId = product._id || product.id;
  const productImage = product.image || 'https://via.placeholder.com/300';
  const productName = product.name || 'Product Name';
  const productFeature = product.feature || ''; // Feature text
  const productDescription = product.description || '';
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
          <Link href={`/products/${productId}`} className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-100">
            <Image
              src={productImage}
              alt={productName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 192px"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
              {badge && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  {badge}
                </span>
              )}
              {discount > 0 && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            >
              <FaHeart className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
            </button>
          </Link>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Title & Description */}
              <Link href={`/products/${productId}`}>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer line-clamp-2">
                  {productName}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 sm:line-clamp-3">{productDescription}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
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
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-black">${discountPrice}</span>
                {actualPrice > discountPrice && (
                  <span className="text-lg text-gray-400 line-through">${actualPrice}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-3 sm:mb-4">
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
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FaShoppingCart className="text-sm sm:text-base" />
                Add to Cart
              </button>
              <button className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-green-50 transition-colors">
                <FaEye className="text-gray-600 text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Professional Design)
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-lg sm:hover:shadow-2xl hover:border-gray-300 transition-all duration-300 overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <Link href={`/products/${productId}`} className="relative aspect-square overflow-hidden block bg-gray-100">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-green-600 text-white px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-green-600 text-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
            title="Add to Wishlist"
          >
            <FaHeart className={`text-sm ${isFavorite ? 'text-red-500' : ''}`} />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Product Title */}
        <Link href={`/products/${productId}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-8 sm:min-h-10 hover:text-green-600 transition-colors leading-tight">
            {productName}
          </h3>
        </Link>

        {/* Feature Text */}
        {productFeature && (
          <p className="text-xs text-gray-500 mb-2 sm:mb-3 line-clamp-1 italic">
            ✨ {productFeature}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-xs ${
                  i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl font-bold text-black">${discountPrice.toFixed(2)}</span>
          {actualPrice > discountPrice && (
            <span className="text-sm text-gray-400 line-through">${actualPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">
                  <span className="font-semibold text-green-600">{stock}</span> in stock
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-600 font-semibold">Out of stock</span>
              </>
            )}
          </div>
          
          {/* Add to Cart Icon */}
          <button 
            className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            title="Add to Cart"
            disabled={stock === 0}
          >
            <FaShoppingCart className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
