import React from 'react';

const RecentOrders = () => {
    const orders = [
        { id: '#ORD-001', customer: 'John Doe', amount: '$125.00', status: 'Completed', date: '2025-10-24' },
        { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', date: '2025-10-24' },
        { id: '#ORD-003', customer: 'Mike Johnson', amount: '$210.00', status: 'Completed', date: '2025-10-23' },
        { id: '#ORD-004', customer: 'Sarah Williams', amount: '$156.75', status: 'Pending', date: '2025-10-23' },
        { id: '#ORD-005', customer: 'David Brown', amount: '$99.00', status: 'Completed', date: '2025-10-22' }
    ];

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrders;
