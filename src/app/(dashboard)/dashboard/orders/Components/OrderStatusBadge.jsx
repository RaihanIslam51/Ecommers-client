import React from 'react';

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            bgColor: 'bg-gray-100',
            textColor: 'text-black',
            icon: '⏳'
        },
        processing: {
            label: 'Processing',
            bgColor: 'bg-gray-100',
            textColor: 'text-black',
            icon: '⚙️'
        },
        shipped: {
            label: 'Shipped',
            bgColor: 'bg-gray-100',
            textColor: 'text-black',
            icon: '🚚'
        },
        delivered: {
            label: 'Delivered',
            bgColor: 'bg-gray-100',
            textColor: 'text-black',
            icon: '✅'
        },
        cancelled: {
            label: 'Cancelled',
            bgColor: 'bg-gray-100',
            textColor: 'text-black',
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
