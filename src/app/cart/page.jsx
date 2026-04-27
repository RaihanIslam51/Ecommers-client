'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { MdRemoveShoppingCart } from 'react-icons/md';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';

const CartPage = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { data: session } = useSession();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by ensuring client-side rendering
  React.useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client is ready to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

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

  const handleProceedToCheckout = () => {
    setIsCheckingOut(true);
    
    setTimeout(() => {
      setShowCheckoutModal(true);
      setIsCheckingOut(false);
    }, 500);
  };

  const handlePlaceOrder = async (formData) => {
    try {
      // Calculate total
      const subtotal = getCartTotal();
      const shipping = subtotal > 0 ? 50 : 0;
      const tax = subtotal * 0.1;
      const total = subtotal + shipping + tax;

      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
        },
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      // Create order via API
      const response = await axiosInstance.post('/orders', orderData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          text: 'Thank you for your order. Order ID: ' + response.data.order._id,
          confirmButtonColor: '#000',
        });

        clearCart();
        setShowCheckoutModal(false);
        router.push('/');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to place order. Please try again.',
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 p-12 text-center">
            <MdRemoveShoppingCart className="mx-auto text-gray-300 text-8xl mb-6" />
            <h2 className="text-3xl font-light text-black mb-4 uppercase tracking-tight">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-sm font-light uppercase tracking-widest">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link 
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-gray-800 duration-200 font-light uppercase tracking-wider text-sm"
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
    <div className="min-h-screen bg-white py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/store"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-light uppercase tracking-widest text-xs"
          >
            ← Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-black uppercase tracking-tight">Shopping Cart</h1>
              <p className="text-gray-600 mt-3 font-light text-xs uppercase tracking-widest">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="hidden md:flex items-center gap-2 px-6 py-3 text-black hover:bg-gray-100 transition-colors border border-gray-200 font-light uppercase tracking-wider text-xs"
              >
                <FaTrash />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const productId = item._id || item.id;
              const itemTotal = (parseFloat(item.price) || 0) * item.quantity;

              return (
                <div 
                  key={productId}
                  className="bg-white border border-gray-200 hover:border-black transition-all duration-200 p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-100 overflow-hidden">
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
                          <h3 className="text-lg md:text-xl font-light text-black mb-2 line-clamp-2">
                            {item.name || 'Product Name'}
                          </h3>
                          <p className="text-xs text-gray-600 mb-4 line-clamp-1 uppercase tracking-widest">
                            {item.description || item.feature || ''}
                          </p>

                          {/* Price */}
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-light text-black">
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
                            <div className="flex items-center border border-gray-200">
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                                className="p-2 md:p-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FaMinus className="text-sm" />
                              </button>
                              <span className="px-4 md:px-6 py-2 font-light text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity, 1)}
                                className="p-2 md:p-3 hover:bg-gray-100 transition-colors"
                              >
                                <FaPlus className="text-sm" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(productId, item.name)}
                              className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 transition-colors border border-gray-200 font-light uppercase tracking-wider text-xs"
                            >
                              <FaTrash className="text-sm" />
                              <span className="hidden md:inline">Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xs text-gray-600 mb-2 uppercase tracking-widest">Total</p>
                          <p className="text-xl md:text-2xl font-light text-black">
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
            <div className="bg-white border border-gray-200 p-8 sticky top-24">
              <h2 className="text-2xl font-light text-black mb-8 uppercase tracking-wide">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-light text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Shipping</span>
                  <span className="font-light text-black">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Tax (5%)</span>
                  <span className="font-light text-black">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-light text-black uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-light text-black">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleProceedToCheckout}
                disabled={isCheckingOut}
                className="w-full bg-black text-white py-4 font-light hover:bg-gray-800 transition-all duration-200 mb-3 text-sm uppercase tracking-wider disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {/* Continue Shopping */}
              <Link 
                href="/store"
                className="block w-full text-center py-3 border border-gray-200 text-black hover:bg-gray-100 transition-all duration-200 font-light uppercase tracking-wider text-xs"
              >
                Continue Shopping
              </Link>

              {/* Shipping Info */}
              {subtotal < 500 && (
                <div className="mt-6 p-4 bg-white border border-gray-200">
                  <p className="text-xs text-gray-600 font-light uppercase tracking-widest">
                    <span className="font-light">Free shipping</span> on orders over $500!
                    <br />
                    Add ${(500 - subtotal).toFixed(2)} more to qualify.
                  </p>
                </div>
              )}

              {/* Clear Cart Mobile */}
              <button
                onClick={handleClearCart}
                className="md:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-black hover:bg-gray-100 transition-colors border border-gray-200 font-light uppercase tracking-wider text-xs"
              >
                <FaTrash />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          onClose={() => setShowCheckoutModal(false)}
          onSubmit={handlePlaceOrder}
          session={session}
        />
      )}
    </div>
  );
};

// Checkout Modal Component
const CheckoutModal = ({ cartItems, subtotal, shipping, tax, total, onClose, onSubmit, session }) => {
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
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

  return (
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-light text-black uppercase tracking-wide">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-black" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div>
              <h3 className="text-lg font-light text-black mb-6 uppercase tracking-wide">Shipping Information</h3>
              <form onSubmit={handleSubmit} id="checkout-form">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="bKash">bKash</option>
                      <option value="nagad">Nagad</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <h3 className="text-lg font-light text-black mb-6 uppercase tracking-wide">Order Summary</h3>
              
              {/* Products List */}
              <div className="bg-white border border-gray-200 p-4 mb-6 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const productId = item._id || item.id;
                    const itemTotal = (parseFloat(item.price) || 0) * item.quantity;
                    
                    return (
                      <div key={productId} className="flex gap-3 bg-white border border-gray-200 p-3">
                        <div className="relative w-16 h-16 shrink-0">
                          <Image
                            src={item.image || 'https://via.placeholder.com/64'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-light text-black line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600 mt-2 uppercase tracking-widest">
                            Qty: {item.quantity} × ${(parseFloat(item.price) || 0).toFixed(2)}
                          </p>
                          <p className="text-sm font-light text-black mt-1">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white border border-gray-200 p-6 space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Subtotal ({cartItems.length} items)</span>
                  <span className="font-light text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Shipping</span>
                  <span className="font-light text-black">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Tax (5%)</span>
                  <span className="font-light text-black">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-light text-black uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-light text-black">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-light uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-6 py-3 border border-gray-200 text-black hover:bg-gray-100 transition-colors font-light uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
