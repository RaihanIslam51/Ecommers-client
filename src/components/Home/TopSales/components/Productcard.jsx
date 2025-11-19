"use client";
import React, { useState, useCallback, memo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaCreditCard } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const ProductCard = ({ product, isDimmed, onQuickView, onClick }) => {
  const router = useRouter();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { data: session } = useSession();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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
    setIsAddingToCart(true);
    
    setTimeout(() => {
      addToCart(product);
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      setIsAddingToCart(false);
    }, 500);
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

  const handleBuyNow = useCallback((e) => {
    e.stopPropagation();
    const productData = encodeURIComponent(JSON.stringify(product));
    router.push(`/quick-checkout?product=${productData}`);
  }, [product, router]);


  
  return (
    <div
      className={`relative group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-200 cursor-pointer transform hover:-translate-y-1 ${
        isDimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
      onClick={onClick}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-4 left-4 z-20 bg-linear-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
          -{discountPercent}% OFF
        </div>
      )}

      {/* Stock Status Badge */}
      {stock === 0 && (
        <div className="absolute top-4 right-4 z-20 bg-gray-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          OUT OF STOCK
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button 
          className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gray-200" 
          onClick={handleAddToWishlist}
          title="Add to Wishlist"
        >
          <FaHeart className={`text-sm transition-colors ${isInWishlist(productId) ? 'text-red-500' : ''}`} />
        </button>
        <button
          className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-500 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(productId);
          }}
          title="Quick View"
        >
          <FaEye className="text-sm" />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Add to Cart Overlay Button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAddingToCart}
            className="bg-black text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <FaShoppingCart className="text-xs" />
               <div className="inline-block whitespace-nowrap"> <span>Add to Cart</span></div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {/* Product Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {product.productType && (
            <span className="bg-linear-to-r from-green-100 to-green-200 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium border border-green-300">
              🌱 {product.productType}
            </span>
          )}
          {/* {product.freshnessLevel && (
            <span className="bg-linear-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-300">
              ✨ {product.freshnessLevel}
            </span>
          )} */}
          {/* {product.packagingType && (
            <span className="bg-linear-to-r from-purple-100 to-purple-200 text-purple-800 text-xs px-2.5 py-1 rounded-full font-medium border border-purple-300">
              📦 {product.packagingType}
            </span>
          )} */}
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-10 group-hover:text-blue-600 transition-colors leading-tight">
          {productName}
        </h3>

        {/* Feature Text */}
        {productFeature && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-1 italic bg-gray-50 px-2 py-1 rounded-md">
            ✨ {productFeature}
          </p>
        )}

        {/* Product Details */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3 bg-gray-50 rounded-lg p-2">
          {product.netWeight && (
            <span className="bg-white px-2 py-1 rounded border">
              ⚖️ {product.netWeight}
            </span>
          )}
          {product.servings && (
            <span className="bg-white px-2 py-1 rounded border">
              🍽️ {product.servings} servings
            </span>
          )}
        </div>

        

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            ${discountPrice.toFixed(2)}
          </span>
          {actualPrice > discountPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${actualPrice.toFixed(2)}
            </span>
          )}
        </div>

       

        {/* Buy Now Button - Only show if not out of stock */}
        {stock > 0 && (
          <button
            onClick={handleBuyNow}
            className="w-full mt-4 bg-linear-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>🛒 Buy Now</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default ProductCard;