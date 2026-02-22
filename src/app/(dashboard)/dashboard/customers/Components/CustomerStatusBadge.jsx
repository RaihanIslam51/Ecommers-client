import React from 'react';

const CustomerStatusBadge = ({ status }) => {
    const statusConfig = {
        active: {
            label: 'Active',
            bg: 'bg-gray-100',
            text: 'text-black',
            dot: 'bg-gray-500'
        },
        inactive: {
            label: 'Inactive',
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            dot: 'bg-gray-500'
        },
        vip: {
            label: 'VIP',
            bg: 'bg-gray-100',
            text: 'text-black',
            dot: 'bg-black'
        },
        new: {
            label: 'New',
            bg: 'bg-gray-100',
            text: 'text-black',
            dot: 'bg-gray-500'
        },
        blocked: {
            label: 'Blocked',
            bg: 'bg-red-100',
            text: 'text-red-700',
            dot: 'bg-red-500'
        }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
            {config.label}
        </span>
    );
};

export default CustomerStatusBadge;
