'use client';
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaBox, FaDollarSign, FaTruck } from 'react-icons/fa';
import { MdCancel, MdCheckCircle, MdLocalShipping } from 'react-icons/md';
import { BiPackage } from 'react-icons/bi';
import Swal from 'sweetalert2';
import axios from '@/lib/axios';
import { useOrders } from '@/context/OrderContext';

const OrderDetailsModal = ({ notification, isOpen, onClose, onStatusUpdate }) => {
  const { updateOrderStatus: updateStatusInContext, getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch complete order details when modal opens
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isOpen || !notification?.orderId) {
        console.log('Modal not open or no orderId:', { isOpen, orderId: notification?.orderId });
        return;
      }

      setLoading(true);
      setOrder(null); // Reset order state
      
      try {
        const orderId = notification.orderId;
        console.log('Fetching order details for:', orderId);
        console.log('Full URL:', `/orders/${orderId}`);
        
        const response = await axios.get(`/orders/${orderId}`);
        console.log('Order response:', response.data);
        
        if (response.data && response.data.order) {
          console.log('Order found:', response.data.order);
          setOrder(response.data.order);
        } else {
          console.log('No order in response');
          Swal.fire({
            icon: 'warning',
            title: 'Order Not Found',
            text: 'Could not find order details',
            confirmButtonColor: '#3b82f6'
          });
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Request URL:', error.config?.url);
        
        // If order not found, try to show notification data as fallback
        if (error.response?.status === 404) {
          Swal.fire({
            icon: 'warning',
            title: 'Order Details Not Available',
            html: `
              <p>Could not find detailed order information.</p>
              <p class="mt-2"><strong>Order ID:</strong> ${notification.orderId}</p>
              <p><strong>Amount:</strong> $${notification.amount?.toFixed(2) || '0.00'}</p>
              <p class="text-sm text-gray-600 mt-2">The order may have been deleted or not yet synced.</p>
            `,
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Close'
          });
          onClose(); // Close the modal
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Load',
            text: error.response?.data?.message || 'Could not load order details. Please try again.',
            confirmButtonColor: '#3b82f6'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [isOpen, notification]);

  // Update order status
  const updateOrderStatus = async (newStatus) => {
    const statusMessages = {
      cancelled: {
        title: 'Cancel Order?',
        text: 'Are you sure you want to cancel this order?',
        confirmText: 'Yes, Cancel Order',
        confirmColor: '#ef4444',
        successTitle: 'Order Cancelled!',
        successText: 'The order has been cancelled successfully.'
      },
      delivered: {
        title: 'Mark as Delivered?',
        text: 'Confirm that this order has been delivered to the customer.',
        confirmText: 'Yes, Mark Delivered',
        confirmColor: '#10b981',
        successTitle: 'Order Delivered!',
        successText: 'The order has been marked as delivered.'
      },
      processing: {
        title: 'Start Processing?',
        text: 'Start processing this order?',
        confirmText: 'Yes, Start Processing',
        confirmColor: '#3b82f6',
        successTitle: 'Order Processing!',
        successText: 'The order is now being processed.'
      },
      shipped: {
        title: 'Mark as Shipped?',
        text: 'Confirm that this order has been shipped.',
        confirmText: 'Yes, Mark Shipped',
        confirmColor: '#8b5cf6',
        successTitle: 'Order Shipped!',
        successText: 'The order has been marked as shipped.'
      }
    };

    const config = statusMessages[newStatus];
    
    const result = await Swal.fire({
      title: config.title,
      text: config.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: config.confirmColor,
      cancelButtonColor: '#6b7280',
      confirmButtonText: config.confirmText,
      cancelButtonText: 'No, Keep Current Status'
    });

    if (result.isConfirmed) {
      setUpdating(true);
      try {
        // Use centralized context function
        const result = await updateStatusInContext(order._id || order.id, newStatus);

        if (result.success) {
          setOrder(result.order);
          
          // Notify parent component
          if (onStatusUpdate) {
            onStatusUpdate(order._id || order.id, newStatus);
          }

          Swal.fire({
            icon: 'success',
            title: config.successTitle,
            text: config.successText,
            timer: 2000,
            showConfirmButton: false
          });

          // Close modal after short delay
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to update order status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Failed to update order status',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setUpdating(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color and label
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', label: 'Pending', icon: '⏳' },
      processing: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Processing', icon: '⚙️' },
      shipped: { color: 'bg-purple-100 text-purple-700 border-purple-300', label: 'Shipped', icon: '🚚' },
      delivered: { color: 'bg-green-100 text-green-700 border-green-300', label: 'Delivered', icon: '✅' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-300', label: 'Cancelled', icon: '❌' }
    };
    return statusMap[status] || statusMap.pending;
  };

  if (!isOpen || !notification) return null;

  const statusInfo = order ? getStatusInfo(order.status) : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-blue-100 text-sm">Order #{notification.orderId}</p>
                </div>
              </div>
              {order && statusInfo && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusInfo.color} font-bold`}>
                  <span className="text-xl">{statusInfo.icon}</span>
                  <span>{statusInfo.label}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-500" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Customer Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.customerInfo?.name || order.customer?.name || order.customer || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <FaPhone className="text-green-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.customerInfo?.phone || order.customer?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 md:col-span-2">
                  <FaMapMarkerAlt className="text-red-600 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.customerInfo?.address || order.shippingAddress?.address || order.customer?.address || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Order Date */}
                <div className="flex items-center gap-3">
                  <FaClock className="text-purple-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(order.date || order.orderDate || order.createdAt || notification.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center gap-3">
                  <FaTruck className="text-green-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Time</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.deliveryTime || '30 minutes'}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-yellow-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {order.paymentMethod || 'Cash on Delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BiPackage className="text-blue-600" />
                Order Items
              </h3>
              <div className="space-y-3">
                {/* Handle different order structures */}
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBox className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name || item.productName || 'Product'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Quantity: {item.quantity || 1} × ${(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">
                          ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : order.product ? (
                  /* Single product structure */
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {order.product.image ? (
                          <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <FaBox className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {order.product.name || 'Product'}
                        </p>
                        <p className="text-xs text-gray-600">
                          Quantity: {order.product.quantity || 1} × ${(order.product.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">
                        ${((order.product.quantity || 1) * (order.product.price || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No items found</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${(order.subtotal || order.totalAmount || order.amount || notification.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${(order.shipping || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${(order.total || order.totalAmount || order.amount || notification.amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTruck className="text-purple-600" />
                Order Status
              </h3>
              <div className="space-y-3">
                {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const statusDetails = getStatusInfo(status);
                  const isActive = order.status === status;
                  const isPassed = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index;
                  
                  return (
                    <div key={status} className={`flex items-center gap-3 p-3 rounded-lg ${isActive ? statusDetails.color : isPassed ? 'bg-gray-100' : 'bg-white'} border ${isActive ? 'border-current' : 'border-gray-200'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${isActive ? 'bg-white/50' : isPassed ? 'bg-green-100' : 'bg-gray-200'}`}>
                        {isPassed ? '✓' : statusDetails.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${isActive ? '' : 'text-gray-600'}`}>
                          {statusDetails.label}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Processing */}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus('processing')}
                      disabled={updating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-semibold"
                    >
                      <MdCheckCircle size={20} />
                      Start Processing
                    </button>
                  )}

                  {/* Shipped */}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button
                      onClick={() => updateOrderStatus('shipped')}
                      disabled={updating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors font-semibold"
                    >
                      <MdLocalShipping size={20} />
                      Mark Shipped
                    </button>
                  )}

                  {/* Delivered */}
                  {(order.status === 'shipped' || order.status === 'processing') && (
                    <button
                      onClick={() => updateOrderStatus('delivered')}
                      disabled={updating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-semibold"
                    >
                      <MdCheckCircle size={20} />
                      Mark Delivered
                    </button>
                  )}

                  {/* Cancel */}
                  {order.status !== 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus('cancelled')}
                      disabled={updating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-semibold"
                    >
                      <MdCancel size={20} />
                      Cancel Order
                    </button>
                  )}
                </div>
                {updating && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-blue-600">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Updating status...</span>
                  </div>
                )}
              </div>
            )}

            {/* Order ID */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-700">
                    {order._id || notification.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Notification ID</p>
                  <p className="text-sm font-mono font-semibold text-gray-700">
                    {notification.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p>No order details available</p>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-linear-to-r from-gray-100 to-gray-200 p-4 rounded-b-2xl border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
