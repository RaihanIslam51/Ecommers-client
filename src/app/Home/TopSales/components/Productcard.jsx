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
  const productDescription = product.description || product.feature || '';
  const actualPrice = product.originalPrice || product.price || 0;
  const discountPrice = product.price || 0;
  const badge = product.badge || (product.originalPrice && product.originalPrice > product.price ? 'discount' : null);
  
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

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      Swal.fire({
        icon: 'info',
        title: 'Already in Wishlist',
        text: 'This product is already in your wishlist',
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
        text: `${productName} has been added to your wishlist`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };
  
  return (
    <article
      className={`relative group w-full bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-900 hover:shadow-xl cursor-pointer ${
        isDimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
      tabIndex={0}
      aria-labelledby={`product-${productId}-name`}
      onClick={onClick}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-20 px-3 py-1 bg-black text-white text-xs font-bold rounded-md shadow-lg uppercase">
          {badge}
        </span>
      )}

      {/* Action Icons - Clean Modern Design */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <button 
          className="w-9 h-9 bg-white hover:bg-black text-gray-700 hover:text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center" 
          aria-label="Add to cart"
          onClick={handleAddToCart}
        >
          <FaShoppingCart className="text-sm" />
        </button>
        <button 
          className={`w-9 h-9 bg-white hover:bg-black text-gray-700 hover:text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
            isInWishlist(productId) ? 'text-red-500' : ''
          }`}
          aria-label="Add to wishlist"
          onClick={handleAddToWishlist}
        >
          <FaHeart className="text-sm" />
        </button>
        <button
          className="w-9 h-9 bg-white hover:bg-black text-gray-700 hover:text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(productId);
          }}
          aria-label="Quick view"
        >
          <FaEye className="text-sm" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-50">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Product Name & Feature */}
        <div className="mb-3">
          <h3 
            id={`product-${productId}-name`} 
            className="text-sm md:text-base font-semibold text-gray-900 truncate mb-1 group-hover:text-black transition-colors"
          >
            {productName}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">{productDescription}</p>
        </div>

        {/* Rating (Optional - can be added if product has rating) */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-xs" />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">(4.5)</span>
        </div>

        {/* Pricing Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold text-black">
              ${discountPrice}
            </span>
            {actualPrice && actualPrice > discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${actualPrice}
              </span>
            )}
          </div>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-600">
            <span className="font-semibold text-black mr-1">{product.stock || 0}</span>
            <span>in stock</span>
          </div>
          
          {/* Add to Cart Button - Visible on Hover */}
          <button 
            className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-md hover:bg-gray-800 transition-all duration-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
