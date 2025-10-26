'use client';
import React from 'react';

const RecentOrders = ({ orders = [] }) => {
    const defaultOrders = [
        { id: 'No orders', customer: 'N/A', amount: 0, status: 'pending', date: new Date().toISOString() }
    ];

    const orderList = orders.length > 0 ? orders : defaultOrders;

    const getStatusColor = (status) => {
        switch(status ? status.toLowerCase() : 'pending') {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Order ID</th>
                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Customer</th>
                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Amount</th>
                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                            <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                <td className="py-4 px-4 text-sm font-semibold text-blue-600">#{order.id}</td>
                                <td className="py-4 px-4 text-sm text-gray-700 font-medium">{order.customer}</td>
                                <td className="py-4 px-4 text-sm font-bold text-green-600">
                                    ${typeof order.amount === 'number' ? order.amount.toFixed(2) : '0.00'}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
