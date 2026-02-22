'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#059669', '#047857'];

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

    const STATUS_COLORS = ['#eab308', '#10b981', '#059669', '#047857', '#ef4444'];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Customer Insights</h3>
            
            {/* Customer Segments Pie Chart */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Customer Segments</h4>
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
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {customerSegments.map((segment, index) => (
                        <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
                            <div 
                                className="w-3 h-3 rounded-full mx-auto mb-1" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <p className="text-xs font-semibold text-gray-800">{segment.value}</p>
                            <p className="text-xs text-gray-500 truncate">{segment.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Status Distribution */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Status</h4>
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
                <div className="grid grid-cols-2 gap-2 mt-3">
                    {orderStatus.slice(0, 4).map((status, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }}
                            ></div>
                            <span className="text-xs text-gray-600 truncate">{status.name}: {status.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-black">{totalCustomers}</p>
                        <p className="text-xs text-gray-600 mt-1">Total Customers</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">
                            {totalCustomers > 0 ? ((customerSegments.find(s => s.name === 'Regular')?.value || 0) / totalCustomers * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Retention Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerStats;
