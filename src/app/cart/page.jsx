'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { useCart } from '@/context/CartContext';
import Swal from 'sweetalert2';

const CartPage = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const handleRemoveItem = (productId, productName) => {
    Swal.fire({
      title: 'Remove Item?',
      text: `Remove "${productName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(productId);
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Item removed from cart',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart?',
      text: 'This will remove all items from your cart',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear cart',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          icon: 'success',
          title: 'Cart Cleared!',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  };

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over $500
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <MdRemoveShoppingCart className="mx-auto text-gray-300 text-8xl mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link 
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold text-lg"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/store"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              >
                <FaTrash />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const productId = item._id || item.id;
              const itemTotal = (parseFloat(item.price) || 0) * item.quantity;

              return (
                <div 
                  key={productId}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 md:p-6"
                >
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || 'https://via.placeholder.com/300'}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
                            {item.name || 'Product Name'}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                            {item.description || item.feature || ''}
                          </p>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-black">
                              ${(parseFloat(item.price) || 0).toFixed(2)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ${parseFloat(item.originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                                className="p-2 md:p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <span className="px-4 md:px-6 py-2 font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, 1)}
                                className="p-2 md:p-3 hover:bg-gray-50 transition-colors"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(productId, item.name)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="text-sm" />
                              <span className="hidden md:inline">Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Total</p>
                          <p className="text-xl md:text-2xl font-bold text-black">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-black">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 mb-3 text-lg"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link 
                href="/store"
                className="block w-full text-center py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Continue Shopping
              </Link>

              {/* Shipping Info */}
              {subtotal < 500 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Free shipping</span> on orders over $500!
                    <br />
                    Add ${(500 - subtotal).toFixed(2)} more to qualify.
                  </p>
                </div>
              )}

              {/* Clear Cart Mobile */}
              <button
                onClick={handleClearCart}
                className="md:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
              >
                <FaTrash />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
