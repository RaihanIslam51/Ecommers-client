import React from 'react';

const OrderStats = ({ stats, activeFilter, onFilterChange }) => {
    const dateStats = [
        {
            id: 1,
            title: 'Total Orders',
            value: stats?.total || '0',
            subtitle: 'All time',
            icon: '📦',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            filterValue: 'all'
        },
        {
            id: 2,
            title: 'Today Orders',
            value: stats?.today || '0',
            subtitle: 'Last 24 hours',
            icon: '📅',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            filterValue: 'today'
        },
        {
            id: 3,
            title: 'Weekly Orders',
            value: stats?.weekly || '0',
            subtitle: 'Last 7 days',
            icon: '📊',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            filterValue: 'week'
        },
        {
            id: 4,
            title: 'Monthly Orders',
            value: stats?.monthly || '0',
            subtitle: 'This month',
            icon: '📈',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            filterValue: 'month'
        }
    ];

    const statusStats = [
        {
            id: 5,
            title: 'Pending',
            value: stats?.pending || '0',
            subtitle: 'Awaiting processing',
            icon: '⏳',
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-600',
            borderColor: 'border-yellow-200'
        },
        {
            id: 6,
            title: 'Processing',
            value: stats?.processing || '0',
            subtitle: 'Being prepared',
            icon: '🔄',
            bgColor: 'bg-cyan-50',
            iconColor: 'text-cyan-600',
            borderColor: 'border-cyan-200'
        },
        {
            id: 7,
            title: 'Shipped',
            value: stats?.shipped || '0',
            subtitle: 'On the way',
            icon: '🚚',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            borderColor: 'border-indigo-200'
        },
        {
            id: 8,
            title: 'Delivered',
            value: stats?.delivered || '0',
            subtitle: 'Completed',
            icon: '✅',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-200'
        },
        {
            id: 9,
            title: 'Cancelled',
            value: stats?.cancelled || '0',
            subtitle: 'Rejected',
            icon: '❌',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            borderColor: 'border-red-200'
        }
    ];

    return (
        <>
            {/* Date Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {dateStats.map((stat) => {
                    const isActive = activeFilter === stat.filterValue;
                    return (
                        <div
                            key={stat.id}
                            onClick={() => onFilterChange && onFilterChange('dateRange', stat.filterValue)}
                            className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-300 cursor-pointer ${
                                isActive 
                                    ? 'border-green-500 shadow-lg scale-105' 
                                    : 'border-gray-100 hover:border-green-300 hover:shadow-md'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgColor} ${stat.iconColor} w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-sm`}>
                                    {stat.icon}
                                </div>
                                {isActive && (
                                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1 uppercase tracking-wide">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.subtitle}</p>
                        </div>
                    );
                })}
            </div>

            {/* Status Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statusStats.map((stat) => (
                    <div
                        key={stat.id}
                        className={`bg-white rounded-xl shadow-sm border-2 ${stat.borderColor} p-5 hover:shadow-md transition-all duration-300`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className={`${stat.bgColor} ${stat.iconColor} w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 shadow-sm`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-gray-600 text-xs font-medium mb-2 uppercase tracking-wide">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OrderStats;
