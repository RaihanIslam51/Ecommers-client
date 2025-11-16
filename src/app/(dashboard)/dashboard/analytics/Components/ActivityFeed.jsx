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
        switch(status) {
            case 'pending': 
                return { icon: 'O', color: 'bg-yellow-100 text-yellow-600' };
            case 'processing': 
                return { icon: 'R', color: 'bg-green-100 text-green-600' };
            case 'shipped': 
                return { icon: 'T', color: 'bg-emerald-100 text-emerald-600' };
            case 'delivered': 
                return { icon: 'D', color: 'bg-green-100 text-green-600' };
            case 'cancelled': 
                return { icon: 'X', color: 'bg-red-100 text-red-600' };
            default: 
                return { icon: 'B', color: 'bg-gray-100 text-gray-600' };
        }
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                    {activities.length} New
                </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map((activity, index) => {
                    const statusInfo = getStatusIcon(activity.status);
                    return (
                        <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className={'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ' + statusInfo.color}>
                                {statusInfo.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    Order #{activity.id} - {activity.customer}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    ${activity.amount.toFixed(2)} • {activity.status}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(activity.date)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityFeed;
