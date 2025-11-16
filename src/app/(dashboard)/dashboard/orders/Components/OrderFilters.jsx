import React from 'react';

const OrderFilters = ({ filters, onFilterChange, onSearch }) => {
    const statusOptions = [
        { value: 'all', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'custom', label: 'Custom Range' }
    ];

    return (
        <div className="bg-white text-black rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Orders
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name..."
                            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        <span className="absolute left-3 top-3 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Status
                    </label>
                    <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        value={filters?.status || 'all'}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        value={filters?.dateRange || 'all'}
                        onChange={(e) => onFilterChange('dateRange', e.target.value)}
                    >
                        {dateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                    Apply Filters
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                    Reset
                </button>
                <button className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                    📥 Export CSV
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;
