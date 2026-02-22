import React from 'react';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'order_placed',
            title: 'New order received',
            description: 'Order #ORD-001 placed by John Doe',
            time: '5 minutes ago',
            icon: '🛍️',
            iconBg: 'bg-green-100',
            iconColor: 'text-black'
        },
        {
            id: 2,
            type: 'order_shipped',
            title: 'Order shipped',
            description: 'Order #ORD-002 has been shipped',
            time: '1 hour ago',
            icon: '🚚',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            id: 3,
            type: 'order_delivered',
            title: 'Order delivered',
            description: 'Order #ORD-003 delivered successfully',
            time: '2 hours ago',
            icon: '✅',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            id: 4,
            type: 'order_cancelled',
            title: 'Order cancelled',
            description: 'Order #ORD-004 cancelled by customer',
            time: '3 hours ago',
            icon: '❌',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600'
        },
        {
            id: 5,
            type: 'payment_received',
            title: 'Payment received',
            description: 'Payment for Order #ORD-005 confirmed',
            time: '4 hours ago',
            icon: '💰',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        }
    ];

    return (
       <div>
        
       </div>
    );
};

export default RecentActivity;
