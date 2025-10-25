'use client';
import React from 'react';

const SalesChart = () => {
    const data = [
        { month: 'Jan', sales: 45 },
        { month: 'Feb', sales: 52 },
        { month: 'Mar', sales: 48 },
        { month: 'Apr', sales: 68 },
        { month: 'May', sales: 72 },
        { month: 'Jun', sales: 85 },
        { month: 'Jul', sales: 78 },
        { month: 'Aug', sales: 90 },
        { month: 'Sep', sales: 82 },
        { month: 'Oct', sales: 95 },
        { month: 'Nov', sales: 88 },
        { month: 'Dec', sales: 100 }
    ];

    const maxValue = Math.max(...data.map(d => d.sales));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Sales Overview</h3>
            <div className="flex items-end justify-between h-64 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-t-lg relative flex items-end" style={{ height: '100%' }}>
                            <div 
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer group relative"
                                style={{ height: `${(item.sales / maxValue) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.sales}k
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{item.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesChart;
