import React from 'react';

const CustomerSegments = () => {
    const segments = [
        {
            name: 'VIP Customers',
            count: 234,
            percentage: 18.8,
            color: 'purple',
            icon: '👑',
            description: 'High-value customers'
        },
        {
            name: 'Regular Customers',
            count: 5678,
            percentage: 45.6,
            color: 'blue',
            icon: '👥',
            description: 'Active buyers'
        },
        {
            name: 'New Customers',
            count: 1247,
            percentage: 10.0,
            color: 'green',
            icon: '🆕',
            description: 'Joined this month'
        },
        {
            name: 'Inactive',
            count: 3199,
            percentage: 25.7,
            color: 'gray',
            icon: '😴',
            description: 'No recent activity'
        }
    ];

    const colorClasses = {
        purple: {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200',
            progress: 'bg-gray-700'
        },
        blue: {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-200',
            progress: 'bg-gray-700'
        },
        green: {
            bg: 'bg-gray-50',
            text: 'text-black',
            border: 'border-gray-200',
            progress: 'bg-gray-700'
        },
        gray: {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            border: 'border-gray-200',
            progress: 'bg-gray-600'
        }
    };

    return (
        <div className="space-y-6">
            {segments.map((segment, idx) => (
                <div key={idx} className="bg-white border border-gray-200 hover:border-black p-8 transition-colors duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-3xl opacity-60">
                                {segment.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-light text-black">{segment.name}</h3>
                                <p className="text-sm text-gray-500 font-light">{segment.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-light text-black">{segment.count}</p>
                            <p className="text-xs text-gray-500 font-light">{segment.percentage}%</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-1">
                        <div 
                            className="bg-black h-1 transition-all duration-300" 
                            style={{ width: `${segment.percentage}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomerSegments;
