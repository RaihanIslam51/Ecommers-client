import React from 'react';

const CustomerStats = () => {
    const stats = [
        { label: 'New Customers', value: 245, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Returning', value: 892, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: 'Total Active', value: 1137, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Statistics</h3>
            <div className="space-y-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`${stat.bgColor} rounded-lg p-4`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full ${stat.color.replace('text', 'bg')}`}
                                style={{ width: `${(stat.value / 1200) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Retention Rate</span>
                    <span className="text-lg font-bold text-green-600">78.5%</span>
                </div>
            </div>
        </div>
    );
};

export default CustomerStats;
