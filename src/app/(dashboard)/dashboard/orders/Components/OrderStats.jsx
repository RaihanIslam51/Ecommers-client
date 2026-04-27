import React from 'react';

const OrderStats = ({ stats, activeFilter, onFilterChange }) => {
    const dateStats = [
        {
            id: 1,
            title: 'Total Orders',
            value: stats?.total || '0',
            subtitle: 'All time',
            icon: '📦',
            filterValue: 'all'
        },
        {
            id: 2,
            title: 'Today Orders',
            value: stats?.today || '0',
            subtitle: 'Last 24 hours',
            icon: '📅',
            filterValue: 'today'
        },
        {
            id: 3,
            title: 'Weekly Orders',
            value: stats?.weekly || '0',
            subtitle: 'Last 7 days',
            icon: '📊',
            filterValue: 'week'
        },
        {
            id: 4,
            title: 'Monthly Orders',
            value: stats?.monthly || '0',
            subtitle: 'This month',
            icon: '📈',
            filterValue: 'month'
        }
    ];

    const statusStats = [
        {
            id: 5,
            title: 'Pending',
            value: stats?.pending || '0',
            subtitle: 'Awaiting processing',
            icon: '⏳'
        },
        {
            id: 6,
            title: 'Processing',
            value: stats?.processing || '0',
            subtitle: 'Being prepared',
            icon: '🔄'
        },
        {
            id: 7,
            title: 'Shipped',
            value: stats?.shipped || '0',
            subtitle: 'On the way',
            icon: '🚚'
        },
        {
            id: 8,
            title: 'Delivered',
            value: stats?.delivered || '0',
            subtitle: 'Completed',
            icon: '✅'
        },
        {
            id: 9,
            title: 'Cancelled',
            value: stats?.cancelled || '0',
            subtitle: 'Rejected',
            icon: '❌'
        }
    ];

    return (
        <>
            {/* Date Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dateStats.map((stat) => {
                    const isActive = activeFilter === stat.filterValue;
                    return (
                        <div
                            key={stat.id}
                            onClick={() => onFilterChange && onFilterChange('dateRange', stat.filterValue)}
                            className={`bg-white p-6 border cursor-pointer transition-all duration-300 ${
                                isActive 
                                    ? 'border-black' 
                                    : 'border-gray-200 hover:border-black'
                            }`} 
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-3xl opacity-70">
                                    {stat.icon}
                                </div>
                                {isActive && (
                                    <span className="bg-black text-white text-xs font-light px-3 py-1 uppercase tracking-widest">
                                        Active
                                    </span>
                                )} 
                            </div>
                            <h3 className="text-xs font-light text-gray-600 mb-2 uppercase tracking-widest">{stat.title}</h3>
                            <p className="text-3xl font-light text-black mb-2">{stat.value}</p>
                            <p className="text-xs text-gray-500 font-light">{stat.subtitle}</p> 
                        </div>
                    );
                })}
            </div>

            {/* Status Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statusStats.map((stat) => (
                    <div
                        key={stat.id}
                        className="bg-white border border-gray-200 hover:border-black p-6 transition-colors duration-300"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="text-2xl mb-3 opacity-60">
                                {stat.icon}
                            </div>
                            <h3 className="text-xs font-light text-gray-600 mb-2 uppercase tracking-widest">{stat.title}</h3>
                            <p className="text-3xl font-light text-black mb-2">{stat.value}</p>
                            <p className="text-xs text-gray-500 font-light">{stat.subtitle}</p>
                        </div>
                    </div>
                ))} 
            </div>
        </>
    );
};

export default OrderStats;
