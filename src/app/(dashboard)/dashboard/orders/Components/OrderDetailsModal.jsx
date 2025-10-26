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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-t-2xl flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Order Details</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Order #{(order._id || order.id).toString().slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <span className="text-2xl">✕</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Order Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Customer Information */}
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {order.customerInfo?.name?.charAt(0) || 'U'}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                    <p className="text-sm font-semibold text-gray-800">
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
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    📦
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Order Information</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {formatDate(order.orderDate)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-green-600">
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
                        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    📍
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Shipping Address</h3>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                                    {order.customerInfo?.address || 'No address provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🛍️</span> Product Details
                        </h3>
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 rounded-xl p-6">
                            <div className="flex gap-6">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <div className="relative w-32 h-32 bg-white rounded-lg overflow-hidden border-2 border-orange-200 shadow-md">
                                        {order.product?.images?.[0] ? (
                                            <Image
                                                src={order.product.images[0]}
                                                alt={order.product.name || 'Product'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                                        {order.product?.name || 'Product Name'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                                            <p className="text-xs text-gray-500 mb-1">Price</p>
                                            <p className="text-lg font-bold text-orange-600">
                                                ${order.product?.price?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {order.quantity || 1}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                                            <p className="text-xs text-gray-500 mb-1">Brand</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {order.product?.brand || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-orange-200">
                                            <p className="text-xs text-gray-500 mb-1">Category</p>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {order.product?.category || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
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
                                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                                    <span className="text-base font-bold text-white">Total Amount</span>
                                    <span className="text-2xl font-bold text-white">
                                        ${order.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-8">
                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                            Update Status
                        </button>
                        <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold">
                            Print Invoice
                        </button>
                        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold">
                            Cancel Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
