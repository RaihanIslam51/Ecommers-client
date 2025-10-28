"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaEye, FaStar, FaTimes } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const ProductCard = ({ product, isDimmed, onQuickView, onClick }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { data: session } = useSession();
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
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

  const handleBuyNow = (e) => {
    e.stopPropagation();
    setIsBuyingNow(true);
    
    setTimeout(() => {
      setShowBuyNowModal(true);
      setIsBuyingNow(false);
    }, 500);
  };

  const handleQuickCheckout = async (formData) => {
    try {
      // Here you can add API call to create order
      await new Promise(resolve => setTimeout(resolve, 1500));

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been successfully placed.',
        confirmButtonColor: '#000',
      });

      setShowBuyNowModal(false);
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to place order. Please try again.',
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
            className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-800 disabled:bg-gray-400"
            onClick={handleAddToCart}
            title="Add to Cart"
            disabled={stock === 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaShoppingCart className="text-xs" />
            )}
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={stock === 0 || isBuyingNow}
          className="w-full mt-3 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold flex items-center justify-center gap-2"
        >
          {isBuyingNow ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            'Buy Now'
          )}
        </button>
      </div>

      {/* Buy Now Modal */}
      {showBuyNowModal && (
        <BuyNowModal
          product={product}
          onClose={() => setShowBuyNowModal(false)}
          onSubmit={handleQuickCheckout}
          session={session}
        />
      )}
    </div>
  );
};

// Buy Now Modal Component
const BuyNowModal = ({ product, onClose, onSubmit, session }) => {
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const totalPrice = (product.price || 0) * formData.quantity;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Quick Checkout</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={product.image || 'https://via.placeholder.com/96'}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-2xl font-bold text-black">${(product.price || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  max={product.stock || 1}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bKash">bKash</option>
                  <option value="nagad">Nagad</option>
                </select>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-2xl">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
