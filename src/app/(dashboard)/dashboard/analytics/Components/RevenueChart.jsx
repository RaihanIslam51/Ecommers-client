'use client';
import React from 'react';

const RevenueChart = () => {
    const data = [
        { day: 'Mon', revenue: 4500, orders: 45 },
        { day: 'Tue', revenue: 5200, orders: 52 },
        { day: 'Wed', revenue: 4800, orders: 48 },
        { day: 'Thu', revenue: 6200, orders: 62 },
        { day: 'Fri', revenue: 7500, orders: 75 },
        { day: 'Sat', revenue: 8900, orders: 89 },
        { day: 'Sun', revenue: 7200, orders: 72 }
    ];

    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Weekly Revenue</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Orders</span>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-3">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative flex items-end" style={{ height: '100%' }}>
                            <div className="w-full flex gap-1">
                                <div 
                                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer group relative"
                                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        ${item.revenue}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RevenueChart;
