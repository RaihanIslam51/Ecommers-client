'use client';
import React from 'react';

const RecentOrders = ({ orders = [] }) => {
    const defaultOrders = [
        { id: 'No orders', customer: 'N/A', amount: 0, status: 'pending', date: new Date().toISOString() }
    ];

    const orderList = orders.length > 0 ? orders : defaultOrders;

    const getStatusColor = (status) => {
        // neutral status badges for analytics-only view
        return 'bg-gray-100 text-gray-800';
    }; 

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-lg font-light text-black mb-8 tracking-wide">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-4 text-xs font-light text-gray-500 uppercase tracking-widest">Order ID</th>
                            <th className="text-left py-4 px-4 text-xs font-light text-gray-500 uppercase tracking-widest">Customer</th>
                            <th className="text-left py-4 px-4 text-xs font-light text-gray-500 uppercase tracking-widest">Amount</th>
                            <th className="text-left py-4 px-4 text-xs font-light text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="text-left py-4 px-4 text-xs font-light text-gray-500 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-5 px-4 text-sm font-light text-black">#{order.id}</td>
                                <td className="py-5 px-4 text-sm text-gray-600 font-light">{order.customer}</td>
                                <td className="py-5 px-4 text-sm font-light text-black">
                                    ${typeof order.amount === 'number' ? order.amount.toFixed(2) : '0.00'}
                                </td>
                                <td className="py-5 px-4">
                                    <span className="inline-block px-3 py-1 border border-gray-200 text-xs font-light text-gray-600">
                                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                                    </span>
                                </td>
                                <td className="py-5 px-4 text-sm text-gray-500 font-light">{formatDate(order.date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
