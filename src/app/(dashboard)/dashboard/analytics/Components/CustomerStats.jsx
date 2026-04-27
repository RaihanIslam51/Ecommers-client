'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#1f2937', '#4b5563', '#6b7280'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-sm text-black">
                    {payload[0].value} customers
                </p>
            </div>
        );
    }
    return null;
};

const CustomerStats = ({ segments = [], statusData = [] }) => {
    const defaultSegments = [
        { name: 'No Data', value: 0 }
    ];

    const defaultStatusData = [
        { name: 'No Data', value: 0 }
    ];

    const customerSegments = segments.length > 0 ? segments : defaultSegments;
    const orderStatus = statusData.length > 0 ? statusData : defaultStatusData;
    const totalCustomers = customerSegments.reduce((sum, s) => sum + s.value, 0);

    const STATUS_COLORS = ['#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#1f2937'];

    return (
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-lg font-light text-black mb-8 tracking-wide">Customer Insights</h3>
            
            {/* Customer Segments Pie Chart */}
            <div className="mb-8">
                <h4 className="text-sm font-light text-gray-600 mb-4 tracking-wide">Customer Segments</h4>
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={customerSegments}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {customerSegments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                    {customerSegments.map((segment, index) => (
                        <div key={index} className="text-center p-3 border border-gray-200 hover:border-black transition-colors">
                            <div 
                                className="w-2 h-2 rounded-full mx-auto mb-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <p className="text-sm font-light text-black">{segment.value}</p>
                            <p className="text-xs text-gray-500 font-light truncate mt-1">{segment.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Status Distribution */}
            <div className="mb-8">
                <h4 className="text-sm font-light text-gray-600 mb-4 tracking-wide">Order Status</h4>
                <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                        <Pie
                            data={orderStatus}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {orderStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {orderStatus.slice(0, 4).map((status, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-2 h-2" 
                                style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }}
                            ></div>
                            <span className="text-xs text-gray-600 font-light truncate">{status.name}: {status.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-light text-black">{totalCustomers}</p>
                        <p className="text-xs text-gray-500 mt-2 font-light">Total Customers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-light text-black">
                            {totalCustomers > 0 ? ((customerSegments.find(s => s.name === 'Regular')?.value || 0) / totalCustomers * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-gray-500 mt-2 font-light">Retention Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerStats;
