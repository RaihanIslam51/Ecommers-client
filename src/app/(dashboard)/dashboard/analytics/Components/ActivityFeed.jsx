'use client';
import React from 'react';

const ActivityFeed = ({ orders = [] }) => {
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
        return Math.floor(seconds / 86400) + ' days ago';
    };

    const getStatusIcon = (status) => {
        // simplified neutral badges for analytics-only view
        return { icon: status ? status.charAt(0).toUpperCase() : 'B', color: 'bg-gray-100 text-black' };
    };

    const defaultActivities = [{ 
        id: '001',
        customer: 'No activity',
        amount: 0,
        status: 'pending',
        date: new Date().toISOString()
    }];

    const activities = orders.length > 0 ? orders.slice(0, 5) : defaultActivities;

    return (
        <div className="bg-white p-8 border border-gray-200 hover:border-black transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-light text-black tracking-wide">Recent Activity</h3>
                <span className="px-3 py-1 border border-gray-200 text-black text-xs font-light tracking-wide">
                    {activities.length} New
                </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity, index) => {
                    const statusInfo = getStatusIcon(activity.status);
                    return (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <div className="w-10 h-10 flex items-center justify-center text-base font-light shrink-0 bg-gray-100 text-black">
                                {statusInfo.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-light text-black truncate">
                                    Order #{activity.id} - {activity.customer}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 font-light">
                                    ${activity.amount.toFixed(2)} • {activity.status}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-light">{getTimeAgo(activity.date)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityFeed;
