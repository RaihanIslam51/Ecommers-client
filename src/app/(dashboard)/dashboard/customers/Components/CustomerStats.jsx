import React from 'react';

const CustomerStats = ({ stats, loading }) => {
    const statsData = [
        {
            label: 'Total Customers',
            value: loading ? '...' : stats?.total || 0,
            icon: '👥',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'All registered customers'
        },
        {
            label: 'VIP Customers',
            value: loading ? '...' : stats?.vip || 0,
            icon: '⭐',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'Spent over $10,000'
        },
        {
            label: 'Active Customers',
            value: loading ? '...' : stats?.active || 0,
            icon: '✅',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'Regular shoppers'
        },
        {
            label: 'New Customers',
            value: loading ? '...' : stats?.new || 0,
            icon: '🆕',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'First-time buyers'
        },
        {
            label: 'Inactive Customers',
            value: loading ? '...' : stats?.inactive || 0,
            icon: '💤',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'No orders in 90 days'
        },
        {
            label: 'Total Revenue',
            value: loading ? '...' : `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: '💰',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'All-time revenue'
        },
        {
            label: 'Lifetime Value',
            value: loading ? '...' : `$${(stats?.lifetimeValue || 0).toFixed(2)}`,
            icon: '📈',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'Lifetime value'
        },
        {
            label: 'Avg Order Value',
            value: loading ? '...' : `$${(stats?.averageOrderValue || 0).toFixed(2)}`,
            icon: '�',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            description: 'Per customer average'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {statsData.map((stat, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className={`${stat.bgColor} ${stat.iconColor} w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 shadow-sm`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerStats;
