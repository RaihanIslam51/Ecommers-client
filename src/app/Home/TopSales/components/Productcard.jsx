"use client";
import React from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaEye, FaStar } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import Swal from "sweetalert2";

const ProductCard = ({ product, isDimmed, onQuickView, onClick }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const productId = product._id || product.id;
  const productImage = product.image || 'https://via.placeholder.com/300';
  const productName = product.name || 'Product Name';
  const productFeature = product.feature || ''; // New feature text
  const actualPrice = product.originalPrice || product.price || 0;
  const discountPrice = product.price || 0;
  const stock = product.stock || 0;
  
  // Calculate discount percentage
  const discountPercent = actualPrice > discountPrice 
    ? Math.round(((actualPrice - discountPrice) / actualPrice) * 100)
    : 0;
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      Swal.fire({
        icon: 'info',
        title: 'Already in Wishlist',
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
  
  return (
    <div
      className={`relative group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-gray-300 cursor-pointer ${
        isDimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
      onClick={onClick}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
          -{discountPercent}%
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          className="w-9 h-9 bg-white hover:bg-black text-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center" 
          onClick={handleAddToWishlist}
          title="Add to Wishlist"
        >
          <FaHeart className={`text-sm ${isInWishlist(productId) ? 'text-red-500' : ''}`} />
        </button>
        <button
          className="w-9 h-9 bg-white hover:bg-black text-gray-700 hover:text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(productId);
          }}
          title="Quick View"
        >
          <FaEye className="text-sm" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-10 group-hover:text-black transition-colors">
          {productName}
        </h3>

        {/* Feature Text */}
        {productFeature && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-1 italic">
            ✨ {productFeature}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-xs" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-black">
            ${discountPrice.toFixed(2)}
          </span>
          {actualPrice > discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${actualPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800"
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
