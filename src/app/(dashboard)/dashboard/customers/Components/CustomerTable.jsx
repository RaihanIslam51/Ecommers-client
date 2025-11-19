import React from 'react';
import CustomerAvatar from './CustomerAvatar';
import CustomerStatusBadge from './CustomerStatusBadge';

const CustomerTable = ({ 
    customers, 
    loading, 
    onViewDetails, 
    onEdit, 
    onDelete,
    selectedCustomers = [],
    onSelectCustomer,
    onSelectAll
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isAllSelected = customers.length > 0 && selectedCustomers.length === customers.length;
    const isSomeSelected = selectedCustomers.length > 0 && selectedCustomers.length < customers.length;

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin text-6xl mb-4">⚙️</div>
                    <p className="text-gray-600 font-medium">Loading customers...</p>
                </div>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No customers found</h3>
                    <p className="text-gray-600">No customers match your search criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                            {onSelectCustomer && (
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={input => {
                                            if (input) {
                                                input.indeterminate = isSomeSelected;
                                            }
                                        }}
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                        title={isAllSelected ? "Deselect all" : "Select all"}
                                    />
                                </th>
                            )}
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Customer Info
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email Address
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Phone Number
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Orders
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Total Spent
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {customers.map((customer, index) => {
                            const isSelected = selectedCustomers.includes(customer.email);
                            
                            return (
                                <tr 
                                    key={customer.id} 
                                    className={`hover:bg-green-50 transition-all duration-200 ${
                                        isSelected ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    {onSelectCustomer && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onSelectCustomer(customer.email)}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                            />
                                        </td>
                                    )}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <CustomerAvatar 
                                            name={customer.name}
                                            image={customer.avatar}
                                            size="md"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm">
                                                {customer.name}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">
                                                {customer.customerId}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">📧</span>
                                        <a 
                                            href={`mailto:${customer.email}`}
                                            className="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors"
                                        >
                                            {customer.email}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">📱</span>
                                        <a 
                                            href={`tel:${customer.phone}`}
                                            className="text-sm text-gray-900 hover:text-green-600 transition-colors font-medium"
                                        >
                                            {customer.phone}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2 max-w-xs">
                                        <span className="text-gray-400 mt-0.5">📍</span>
                                        <div className="text-sm text-gray-600 line-clamp-2">
                                            {customer.address}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <CustomerStatusBadge status={customer.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full px-3 py-1">
                                        <span className="text-sm font-bold">{customer.totalOrders}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-sm font-bold text-green-600">
                                        ${customer.totalSpent.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="text-sm text-gray-900">{formatDate(customer.joinedDate)}</div>
                                    {customer.lastOrderDate && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Last: {formatDate(customer.lastOrderDate)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewDetails(customer)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg font-medium text-sm transition-all"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg font-medium text-sm transition-all"
                                            title="Edit Customer"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDelete(customer)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition-all"
                                            title="Delete Customer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Table Footer with Summary */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{customers.length}</span> customer{customers.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-600">
                            Total Orders: <span className="font-bold text-green-600">
                                {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            Total Revenue: <span className="font-bold text-green-600">
                                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;
