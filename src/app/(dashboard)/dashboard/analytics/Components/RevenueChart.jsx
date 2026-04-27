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
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-lg font-light text-black tracking-wide">Weekly Revenue</h3>
                    <p className="text-xs text-gray-500 mt-2 font-light">Last 7 days breakdown</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-light text-black">
                        ${totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-light">Total Revenue</p>
                </div>
            </div>

            <div className="h-56 sm:h-72 md:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1f2937" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4b5563" stopOpacity={0.4}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="day" 
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="revenue" 
                            fill="url(#colorRevenue)" 
                            radius={[0, 0, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-3xl font-light text-black">
                        ${avgRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-light">Avg Daily Revenue</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-light text-black">
                        {chartData.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 font-light">Days Tracked</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
