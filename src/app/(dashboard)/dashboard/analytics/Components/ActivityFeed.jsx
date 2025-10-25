import React from 'react';

const ActivityFeed = () => {
    const activities = [
        { 
            type: 'order', 
            message: 'New order placed by John Doe', 
            time: '5 min ago',
            icon: '🛒',
            color: 'bg-blue-100 text-blue-600'
        },
        { 
            type: 'user', 
            message: 'New customer registered: Sarah Williams', 
            time: '12 min ago',
            icon: '👤',
            color: 'bg-green-100 text-green-600'
        },
        { 
            type: 'product', 
            message: 'Product "Wireless Headphones" is low in stock', 
            time: '23 min ago',
            icon: '⚠️',
            color: 'bg-yellow-100 text-yellow-600'
        },
        { 
            type: 'payment', 
            message: 'Payment received from Mike Johnson', 
            time: '1 hour ago',
            icon: '💳',
            color: 'bg-purple-100 text-purple-600'
        },
        { 
            type: 'review', 
            message: 'New 5-star review on Smart Watch', 
            time: '2 hours ago',
            icon: '⭐',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`${activity.color} w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                            {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Activities →
            </button>
        </div>
    );
};

export default ActivityFeed;
