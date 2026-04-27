import React from 'react';

const RecentActivity = () => {
    const activities = [
        {
            id: 1,
            type: 'order_placed',
            title: 'New order received',
            description: 'Order #ORD-001 placed by John Doe',
            time: '5 minutes ago',
            icon: '🛍️'
        },
        {
            id: 2,
            type: 'order_shipped',
            title: 'Order shipped',
            description: 'Order #ORD-002 has been shipped',
            time: '1 hour ago',
            icon: '🚚'
        },
        {
            id: 3,
            type: 'order_delivered',
            title: 'Order delivered',
            description: 'Order #ORD-003 delivered successfully',
            time: '2 hours ago',
            icon: '✅'
        },
        {
            id: 4,
            type: 'order_cancelled',
            title: 'Order cancelled',
            description: 'Order #ORD-004 cancelled by customer',
            time: '3 hours ago',
            icon: '❌'
        },
        {
            id: 5,
            type: 'payment_received',
            title: 'Payment received',
            description: 'Payment for Order #ORD-005 confirmed',
            time: '4 hours ago',
            icon: '💰'
        }
    ];

    return (
       <div className="bg-white border border-gray-200 p-8">
           <h2 className="text-2xl font-light text-black mb-6 tracking-wide">Recent Activity</h2>
           
           <div className="space-y-0">
               {activities.map((activity, idx) => (
                   <div
                       key={activity.id}
                       className={`pb-6 pt-6 flex gap-4 ${idx !== activities.length - 1 ? 'border-b border-gray-200' : ''}`}
                   >
                       {/* Icon */}
                       <div className="text-2xl opacity-60 flex-shrink-0">
                           {activity.icon}
                       </div>

                       {/* Content */}
                       <div className="flex-1 min-w-0">
                           <h3 className="font-light text-black text-sm">{activity.title}</h3>
                           <p className="text-xs text-gray-600 font-light mt-1">{activity.description}</p>
                           <p className="text-xs text-gray-400 font-light mt-2">{activity.time}</p>
                       </div>
                   </div>
               ))}
           </div>

           {/* View All Link */}
           <div className="mt-6 pt-6 border-t border-gray-200">
               <button className="text-xs font-light text-black hover:text-gray-600 uppercase tracking-widest transition-colors">
                   View All Activity →
               </button>
           </div>
       </div>
    );
};

export default RecentActivity;
