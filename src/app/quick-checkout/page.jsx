"use client";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaCreditCard, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";

const QuickCheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  // Get product data from URL params
  const productData = searchParams.get('product');
  const product = productData ? JSON.parse(decodeURIComponent(productData)) : null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
    quantity: 1,
    deliveryTime: '30 minutes',
    deliveryLocation: 'inside', // 'inside' for Dhaka, 'outside' for outside Dhaka
  });

  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by ensuring client-side rendering
  React.useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  // Update form data when session becomes available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || prev.fullName,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (!product) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No product data found',
      }).then(() => {
        router.push('/');
      });
    }
  }, [product, router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Calculate delivery charge
    const deliveryCharge = formData.deliveryLocation === 'inside' ? 70 : 130;
    const subtotal = (product.price || 0) * formData.quantity;
    const totalAmount = subtotal + deliveryCharge;

    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
        },
        items: [{
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity: formData.quantity,
          image: product.image
        }],
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        deliveryLocation: formData.deliveryLocation === 'inside' ? 'Dhaka' : 'Outside Dhaka',
        totalAmount: totalAmount,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        paymentMethod: formData.paymentMethod,
        deliveryTime: formData.deliveryTime,
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      // Create order via API
      const response = await axiosInstance.post('/orders', orderData);

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been successfully placed. Order ID: ' + response.data.order._id,
          confirmButtonColor: '#3b82f6',
        }).then(() => {
          router.push('/');
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until client is ready to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate delivery charge based on location
  const deliveryCharge = formData.deliveryLocation === 'inside' ? 70 : 130;
  const subtotal = (product.price || 0) * formData.quantity;
  const totalPrice = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 font-light uppercase tracking-widest text-xs"
          >
            ← Back to Products
          </button>
          <h1 className="text-4xl lg:text-5xl font-light text-black uppercase tracking-tight">Quick Checkout</h1>
          <p className="text-sm font-light text-gray-600 mt-3 uppercase tracking-widest">Complete your order in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-light text-black mb-8 uppercase tracking-wide">Shipping Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Enter your full name"
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
                      placeholder="Enter your email"
                    />
                  </div>
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
                    placeholder="Enter your phone number"
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
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors resize-none"
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="Enter your city"
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
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                    Delivery Location *
                  </label>
                  <select
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                  >
                    <option value="inside">Inside Dhaka - 70 Taka</option>
                    <option value="outside">Outside Dhaka - 130 Taka</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
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
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                      Delivery Time *
                    </label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light text-black bg-white transition-colors"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="4 hours">4 hours</option>
                      <option value="1 day">1 day</option>
                      <option value="2 days">2 days</option>
                    </select>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-all text-lg font-light uppercase tracking-wider disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-8 sticky top-8">
              <h2 className="text-2xl font-light text-black mb-8 uppercase tracking-wide">Order Summary</h2>
              
              {/* Product Info */}
              <div className="flex gap-4 mb-8 p-4 bg-white border border-gray-200">
                <div className="relative w-24 h-24 shrink-0 overflow-hidden">
                  <Image
                    src={product.image || 'https://via.placeholder.com/96'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-light text-black mb-3 text-sm">{product.name}</h3>
                  <p className="text-xl font-light text-black">${(product.price || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-8 border-b border-gray-200 pb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Quantity:</span>
                  <span className="font-light text-black">{formData.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Price per item:</span>
                  <span className="font-light text-black">${(product.price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Delivery Time:</span>
                  <span className="font-light text-black">{formData.deliveryTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Subtotal:</span>
                  <span className="font-light text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Delivery Location:</span>
                  <span className="font-light text-black">{formData.deliveryLocation === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Delivery Charge:</span>
                  <span className="font-light text-black">${deliveryCharge}</span>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-light text-gray-600 uppercase tracking-widest">Total Amount:</span>
                  <span className="text-3xl font-light text-black">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-3 uppercase tracking-widest">Includes all applicable taxes and delivery</p>
              </div>

              {/* Payment Method Badge */}
              <div className="mt-8 p-4 bg-white border border-gray-200">
                <p className="text-xs text-gray-600 mb-3 uppercase tracking-widest">Selected Payment Method:</p>
                <div className="flex items-center gap-2">
                  <span className="font-light text-black capitalize">
                    {formData.paymentMethod === 'cash' ? 'Cash on Delivery' : formData.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

QuickCheckoutContent.displayName = 'QuickCheckoutContent';

export default function QuickCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    </div>}>
      <QuickCheckoutContent />
    </Suspense>
  );
}
