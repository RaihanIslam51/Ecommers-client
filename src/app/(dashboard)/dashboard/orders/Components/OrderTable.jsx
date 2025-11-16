import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import Image from 'next/image';
import Swal from 'sweetalert2';

const OrderTable = ({ orders = [], loading, onViewDetails, onUpdateStatus, onDeleteOrder }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600">Orders will appear here once customers place them.</p>
            </div>
        );
    }

    const handleStatusChange = async (order) => {
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
            onUpdateStatus(order._id || order.id, newStatus);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Product
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-green-600">
                                        #{(order._id || order.id).toString().slice(-8).toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                            {order.customerInfo?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-800 block">
                                                {order.customerInfo?.name || 'Unknown'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {order.customerInfo?.email || ''}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {order.product?.image && (
                                            <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                                <Image
                                                    src={order.product.image}
                                                    alt={order.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {order.product?.name || 'Product'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {order.product?.quantity || 1}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(order.orderDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-800">
                                        ${order.totalAmount?.toFixed(2) || '0.00'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <OrderStatusBadge status={order.status || 'pending'} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewDetails && onViewDetails(order)}
                                            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(order)}
                                            className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                                            title="Update Status"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDeleteOrder && onDeleteOrder(order._id || order.id)}
                                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{orders.length}</span> order{orders.length !== 1 ? 's' : ''}
                </div>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-800">${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;
