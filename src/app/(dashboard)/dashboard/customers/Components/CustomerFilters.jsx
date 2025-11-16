import React, { useState } from 'react';

const CustomerFilters = ({ onFilterChange, onSearch, onSort }) => {
    const [searchType, setSearchType] = useState('all');
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (value) => {
        setSearchValue(value);
        onSearch(value, searchType);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        onSearch(searchValue, type);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Advanced Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Customers
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={
                                    searchType === 'email' ? 'Search by email...' :
                                    searchType === 'phone' ? 'Search by phone...' :
                                    searchType === 'name' ? 'Search by name...' :
                                    'Search customers...'
                                }
                                value={searchValue}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            />
                            <span className="absolute left-3 top-3 text-gray-400">
                                {searchType === 'email' ? '�' : searchType === 'phone' ? '📱' : '�🔍'}
                            </span>
                        </div>
                        <select
                            value={searchType}
                            onChange={(e) => handleSearchTypeChange(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
                        >
                            <option value="all">All</option>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                    {/* Search Type Pills */}
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={() => handleSearchTypeChange('all')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                searchType === 'all' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('name')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                searchType === 'name' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            👤 Name
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('email')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                searchType === 'email' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            📧 Email
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('phone')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                searchType === 'phone' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            📱 Phone
                        </button>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="vip">VIP</option>
                        <option value="new">New</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                    </label>
                    <select
                        onChange={(e) => onSort(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    >
                        <option value="name">Name</option>
                        <option value="totalSpent">Total Spent</option>
                        <option value="totalOrders">Total Orders</option>
                        <option value="joinedDate">Join Date</option>
                    </select>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
                <button 
                    onClick={() => onFilterChange('quick', 'vip')}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold hover:bg-purple-200 transition-colors"
                >
                    💎 VIP Customers
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'new')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200 transition-colors"
                >
                    ⭐ New This Month
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'high-spender')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200 transition-colors"
                >
                    💰 High Spenders
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'inactive')}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                    😴 Inactive
                </button>
            </div>
        </div>
    );
};

export default CustomerFilters;
