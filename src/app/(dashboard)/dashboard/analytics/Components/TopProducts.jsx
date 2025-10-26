'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-sm text-blue-600">
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Top Products & Categories</h3>
            
            {/* Pie Chart */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Sales by Category</h4>
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
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-xs text-gray-600 truncate">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products List */}
            <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Best Sellers</h4>
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 shrink-0">
                                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
                                    <p className="text-xs text-gray-500">{product.quantity} sold</p>
                                </div>
                            </div>
                            <div className="text-right ml-2">
                                <p className="text-sm font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopProducts;
