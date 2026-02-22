'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">{label}</p>
                <p className="text-sm text-black">
                    Revenue: ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const RevenueChart = ({ data = [] }) => {
    const defaultData = [
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 0 },
        { day: 'Wed', revenue: 0 },
        { day: 'Thu', revenue: 0 },
        { day: 'Fri', revenue: 0 },
        { day: 'Sat', revenue: 0 },
        { day: 'Sun', revenue: 0 }
    ];

    const chartData = data.length > 0 ? data : defaultData;
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
    const avgRevenue = Math.round(totalRevenue / chartData.length);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-black">Weekly Revenue</h3>
                    <p className="text-sm text-gray-500 mt-1">Last 7 days breakdown</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-black">
                        ${totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
            </div>

            <div className="h-56 sm:h-72 md:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0.8}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="day" 
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
                        <Bar 
                            dataKey="revenue" 
                            fill="url(#colorRevenue)" 
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-2xl font-bold text-black">
                        ${avgRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Avg Daily Revenue</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-black">
                        {chartData.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Days Tracked</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
