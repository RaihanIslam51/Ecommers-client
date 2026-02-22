import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import Image from 'next/image';
import Swal from 'sweetalert2';

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus, onDeleteOrder }) => {
    if (!isOpen || !order) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = async () => {
        const { value: newStatus } = await Swal.fire({
            title: 'Update Order Status',
            input: 'select',
            inputOptions: {
                pending: 'Pending',
                processing: 'Processing',
                shipped: 'Shipped',
                delivered: 'Delivered',
                cancelled: 'Cancelled'
            },
            inputPlaceholder: 'Select status',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            inputValue: order.status || 'pending'
        });

        if (newStatus && onUpdateStatus) {
            await onUpdateStatus(order._id || order.id, newStatus);
            onClose();
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed && onDeleteOrder) {
            await onDeleteOrder(order._id || order.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-gray-50 px-8 py-6 rounded-t-2xl flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Order Details</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Order #{(order._id || order.id).toString().slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-black hover:bg-gray-100 rounded-full p-2 transition-colors"
                    >
                        <span className="text-2xl">✕</span>
                    </button>
                </div> 

                {/* Content */}
                <div className="p-8">
                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Customer Information */}
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold text-xl">
                                    {order.customerInfo?.name?.charAt(0) || 'U'}
                                </div>
                                <h3 className="text-lg font-bold text-black">Customer Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                    <p className="text-sm font-semibold text-black">
                                        {order.customerInfo?.name || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                    <p className="text-sm font-semibold text-gray-800 break-all">
                                        {order.customerInfo?.email || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {order.customerInfo?.phone || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold text-xl">
                                    📦
                                </div>
                                <h3 className="text-lg font-bold text-black">Order Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                    <p className="text-sm font-semibold text-black">
                                        {formatDate(order.orderDate)}
                                    </p>
                                </div> 
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Delivery Time</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {order.deliveryTime || '30 minutes'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-black">
                                        ${order.totalAmount?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Order Status</p>
                                    <OrderStatusBadge status={order.status || 'pending'} />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black font-bold text-xl">
                                    📍
                                </div>
                                <h3 className="text-lg font-bold text-black">Shipping Address</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                    {order.customerInfo?.address || 'No address provided'}
                                </p>
                            </div>
                        </div> 
                    </div>

                   
                    {/* Order Summary */}
                    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>💰</span> Order Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-800">
                                    ${((order.product?.price || 0) * (order.quantity || 1)).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-600">Shipping</span>
                                <span className="font-semibold text-gray-800">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                <span className="text-sm text-gray-600">Tax</span>
                                <span className="font-semibold text-gray-800">$0.00</span>
                            </div>
                            <div className="border-t-2 border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                                    <span className="text-base font-bold text-black">Total Amount</span>
                                    <span className="text-2xl font-bold text-black">
                                        ${order.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div> 
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-8">
                        <button className="flex-1 px-6 py-3 border border-gray-300 bg-white text-black rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                            Update Status
                        </button>
                        <button className="flex-1 px-6 py-3 border border-gray-300 bg-white text-black rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                            Print Invoice
                        </button>
                        <button className="px-6 py-3 border border-gray-200 bg-white text-black rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
