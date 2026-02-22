import React from 'react';
import CustomerAvatar from './CustomerAvatar';
import CustomerStatusBadge from './CustomerStatusBadge';

const CustomerDetailsModal = ({ customer, onClose }) => {
    if (!customer) return null;

    const recentOrders = [
        { id: '#ORD-001', date: '2024-01-15', total: 234, status: 'Delivered' },
        { id: '#ORD-002', date: '2024-01-10', total: 156, status: 'Shipped' },
        { id: '#ORD-003', date: '2024-01-05', total: 478, status: 'Delivered' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <CustomerAvatar name={customer.name} image={customer.avatar} size="xl" />
                            <div>
                                <h2 className="text-2xl font-bold text-black">{customer.name}</h2>
                                <p className="text-gray-500 mt-1">{customer.customerId}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                            <div className="text-2xl font-bold text-black">{customer.totalOrders}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                            <div className="text-2xl font-bold text-black">${customer.totalSpent.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-600 mb-1">Status</div>
                            <div className="mt-2">
                                <CustomerStatusBadge status={customer.status} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">📧</span>
                                <div>
                                    <div className="text-sm text-gray-600">Email</div>
                                    <div className="font-medium text-black">{customer.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <div className="text-sm text-gray-600">Phone</div>
                                    <div className="font-medium text-black">{customer.phone}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">📍</span>
                                <div>
                                    <div className="text-sm text-gray-600">Address</div>
                                    <div className="font-medium text-black">{customer.address || 'Not provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">📅</span>
                                <div>
                                    <div className="text-sm text-gray-600">Joined Date</div>
                                    <div className="font-medium text-black">{customer.joinedDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div>
                        <h3 className="text-lg font-bold text-black mb-4">Recent Orders</h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-black">{order.id}</td>
                                            <td className="px-4 py-3 text-gray-600">{order.date}</td>
                                            <td className="px-4 py-3 font-semibold text-black">${order.total}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <button className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                            Send Email
                        </button>
                        <button className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                            View All Orders
                        </button>
                        <button className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
