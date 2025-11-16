import React from 'react';

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            icon: '⏳'
        },
        processing: {
            label: 'Processing',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            icon: '⚙️'
        },
        shipped: {
            label: 'Shipped',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700',
            icon: '🚚'
        },
        delivered: {
            label: 'Delivered',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            icon: '✅'
        },
        cancelled: {
            label: 'Cancelled',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            icon: '❌'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor}`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
