import React from 'react';

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            icon: '⏳'
        },
        processing: {
            label: 'Processing',
            icon: '⚙️'
        },
        shipped: {
            label: 'Shipped',
            icon: '🚚'
        },
        delivered: {
            label: 'Delivered',
            icon: '✅'
        },
        cancelled: {
            label: 'Cancelled',
            icon: '❌'
        }
    }; 

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-black text-xs font-light uppercase tracking-widest hover:border-black transition-colors">
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
