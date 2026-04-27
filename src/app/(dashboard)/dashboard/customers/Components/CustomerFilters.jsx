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
        <div className="bg-white border border-gray-200 hover:border-black p-8 mb-8 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Advanced Search */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
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
                                className="w-full px-4 py-2.5 pl-10 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
                            />
                            <span className="absolute left-3 top-3 text-gray-400">
                                {searchType === 'email' ? '�' : searchType === 'phone' ? '📱' : '�🔍'}
                            </span>
                        </div>
                        <select
                            value={searchType}
                            onChange={(e) => handleSearchTypeChange(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
                        >
                            <option value="all">All</option>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                    {/* Search Type Pills */}
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => handleSearchTypeChange('all')}
                            className={`px-4 py-2 text-xs font-light uppercase tracking-widest transition-all ${
                                searchType === 'all' 
                                    ? 'bg-black text-white border border-black' 
                                    : 'bg-white border border-gray-200 text-black hover:border-black'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('name')}
                            className={`px-4 py-2 text-xs font-light uppercase tracking-widest transition-all ${
                                searchType === 'name' 
                                    ? 'bg-black text-white border border-black' 
                                    : 'bg-white border border-gray-200 text-black hover:border-black'
                            }`}
                        >
                            👤 Name
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('email')}
                            className={`px-4 py-2 text-xs font-light uppercase tracking-widest transition-all ${
                                searchType === 'email' 
                                    ? 'bg-black text-white border border-black' 
                                    : 'bg-white border border-gray-200 text-black hover:border-black'
                            }`}
                        >
                            📧 Email
                        </button>
                        <button
                            onClick={() => handleSearchTypeChange('phone')}
                            className={`px-4 py-2 text-xs font-light uppercase tracking-widest transition-all ${
                                searchType === 'phone' 
                                    ? 'bg-black text-white border border-black' 
                                    : 'bg-white border border-gray-200 text-black hover:border-black'
                            }`}
                        >
                            📱 Phone
                        </button>
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Status
                    </label>
                    <select
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
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
                    <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                        Sort By
                    </label>
                    <select
                        onChange={(e) => onSort(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
                    >
                        <option value="name">Name</option>
                        <option value="totalSpent">Total Spent</option>
                        <option value="totalOrders">Total Orders</option>
                        <option value="joinedDate">Join Date</option>
                    </select>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-2">
                <span className="text-xs font-light text-gray-600 uppercase tracking-widest mr-2">Quick Filters:</span>
                <button 
                    onClick={() => onFilterChange('quick', 'vip')}
                    className="px-4 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white text-xs font-light uppercase tracking-widest transition-all"
                >
                    💎 VIP Customers
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'new')}
                    className="px-4 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white text-xs font-light uppercase tracking-widest transition-all"
                >
                    ⭐ New This Month
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'high-spender')}
                    className="px-4 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white text-xs font-light uppercase tracking-widest transition-all"
                >
                    💰 High Spenders
                </button>
                <button 
                    onClick={() => onFilterChange('quick', 'inactive')}
                    className="px-4 py-2 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white text-xs font-light uppercase tracking-widest transition-all"
                >
                    😴 Inactive
                </button>
            </div>
        </div>
    );
};

export default CustomerFilters;
