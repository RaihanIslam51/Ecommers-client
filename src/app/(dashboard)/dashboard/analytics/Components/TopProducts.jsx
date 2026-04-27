'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#1f2937', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-black">{payload[0].name}</p>
                <p className="text-sm text-black">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const TopProducts = ({ products = [], categoryData = [] }) => {
    const defaultProducts = [
        { name: 'No Data', revenue: 0, quantity: 0 }
    ];

    const defaultCategoryData = [
        { name: 'No Data', value: 0 }
    ];

    const topProducts = products.length > 0 ? products.slice(0, 5) : defaultProducts;
    const pieData = categoryData.length > 0 ? categoryData : defaultCategoryData;

    return (
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-lg font-light text-black mb-8 tracking-wide">Top Products & Categories</h3>
            
            {/* Pie Chart */}
            <div className="mb-8">
                <h4 className="text-sm font-light text-gray-600 mb-4 tracking-wide">Sales by Category</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-2 h-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-xs text-gray-600 font-light truncate">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products List */}
            <div>
                <h4 className="text-sm font-light text-gray-600 mb-4 tracking-wide">Best Sellers</h4>
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 shrink-0">
                                    <span className="text-xs font-light text-black">#{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-light text-black truncate">{product.name}</h4>
                                    <p className="text-xs text-gray-500 font-light">{product.quantity} sold</p>
                                </div>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-sm font-light text-black">${product.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopProducts;
