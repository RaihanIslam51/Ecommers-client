'use client';
import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">{label}</p>
                <p className="text-sm text-black">
                    Sales: ${payload[0].value.toLocaleString()}
                </p>
                <p className="text-sm text-emerald-600">
                    Orders: {payload[1].value}
                </p>
            </div>
        );
    }
    return null;
};

const SalesChart = ({ data = [] }) => {
    // Fallback data if none provided
    const defaultData = [
        { date: 'Jan 1', sales: 0, orders: 0 },
        { date: 'Jan 2', sales: 0, orders: 0 }
    ];

    const chartData = data.length > 0 ? data : defaultData;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-black">Sales & Orders Trend</h3>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days performance</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600">Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600">Orders</span>
                    </div>
                </div>
            </div>
            
            <div className="h-56 sm:h-72 md:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.18}/>
                                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#374151" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#6B7280" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorOrders)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-2xl font-bold text-black">
                        ${chartData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Total Sales</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-black">
                        {chartData.reduce((sum, d) => sum + d.orders, 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Total Orders</p>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
