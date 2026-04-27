import React from 'react';

const CustomerStats = ({ stats, loading }) => {
    const statsData = [
        {
            label: 'Total Customers',
            value: loading ? '...' : stats?.total || 0,
            icon: '👥',
            description: 'All registered customers'
        },

        {
            label: 'VIP Customers',
            value: loading ? '...' : stats?.vip || 0,
            icon: '⭐',
            description: 'Spent over $10,000'
        },
        {
            label: 'Active Customers',
            value: loading ? '...' : stats?.active || 0,
            icon: '✅',
            description: 'Regular shoppers'
        },
        {
            label: 'New Customers',
            value: loading ? '...' : stats?.new || 0,
            icon: '🆕',
            description: 'First-time buyers'
        },
        {
            label: 'Inactive Customers',
            value: loading ? '...' : stats?.inactive || 0,
            icon: '💤',
            description: 'No orders in 90 days'
        },
        {
            label: 'Total Revenue',
            value: loading ? '...' : `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: '💰',
            description: 'All-time revenue'
        },
        {
            label: 'Lifetime Value',
            value: loading ? '...' : `$${(stats?.lifetimeValue || 0).toFixed(2)}`,
            icon: '📈',
            description: 'Lifetime value'
        },
        {
            label: 'Avg Order Value',
            value: loading ? '...' : `$${(stats?.averageOrderValue || 0).toFixed(2)}`,
            icon: '🛒',
            description: 'Per customer average'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {statsData.map((stat, index) => (
                <div 
                    key={index} 
                    className="bg-white border border-gray-200 hover:border-black p-6 transition-colors duration-300"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="text-2xl mb-3 opacity-60">
                            {stat.icon}
                        </div>
                        <p className="text-xs font-light text-gray-600 mb-2 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-light text-black mb-2">{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-light">{stat.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerStats;
