"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Image from 'next/image';

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash',
    deliveryTime: '30 minutes',
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
    
    if (!cart || cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is Empty',
        text: 'Please add items to cart before checkout',
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
        },
        items: cart.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image
        })),
        totalAmount: getTotalPrice() + 5, // including shipping
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
          confirmButtonColor: '#000',
        }).then(() => {
          clearCart();
          router.push('/');
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to place order. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Safety check for cart
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-4 uppercase tracking-tight">Your Cart is Empty</h2>
          <button
            onClick={() => router.push('/store')}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <h1 className="text-4xl lg:text-5xl font-light text-black mb-12 uppercase tracking-tight">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-2xl font-light text-black mb-8 uppercase tracking-wide">Shipping Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                </div>

                <div className="mb-6">
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

                <div className="mb-6">
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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                <div className="mb-8">
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

                <div className="mb-8">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-light uppercase tracking-wider"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-8 sticky top-8">
              <h2 className="text-2xl font-light text-black mb-8 uppercase tracking-wide">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <div key={item._id || item.id} className="flex gap-4 border-b border-gray-200 pb-6">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={item.image || 'https://via.placeholder.com/80'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-light text-black line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2 uppercase tracking-widest">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="text-sm font-light text-black mt-2">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Subtotal</span>
                  <span className="font-light text-black">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-xs font-light text-gray-600 uppercase tracking-widest">Shipping</span>
                  <span className="font-light text-black">$5.00</span>
                </div>
                <div className="flex justify-between text-lg pt-6 border-t border-gray-200">
                  <span className="font-light text-black uppercase tracking-widest">Total</span>
                  <span className="font-light text-black">${(getTotalPrice() + 5).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
