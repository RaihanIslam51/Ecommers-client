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
        <div className="bg-white text-black border border-gray-200 hover:border-black p-8 mb-8 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search Input */}
                <div className="lg:col-span-2">
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Search Orders
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name..."
                            className="w-full px-4 py-3 pl-10 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                        <span className="absolute left-3 top-3.5 text-gray-300">
                            🔍
                        </span>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Order Status
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
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
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Date Range
                    </label>
                    <select
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
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
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-2 border border-gray-200 bg-white text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300 font-light text-sm">
                    Apply Filters
                </button>
                <button className="px-6 py-2 border border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black transition-all duration-300 font-light text-sm">
                    Reset
                </button>
                <button className="ml-auto px-6 py-2 border border-gray-200 bg-white text-black hover:border-black hover:bg-black hover:text-white transition-all duration-300 font-light text-sm">
                    📥 Export CSV
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;
