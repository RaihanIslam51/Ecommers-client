import React from 'react';

const CustomerStatusBadge = ({ status }) => {
    const statusConfig = {
        active: {
            label: 'Active',
            icon: '✓'
        },
        inactive: {
            label: 'Inactive',
            icon: '—'
        },
        vip: {
            label: 'VIP',
            icon: '★'
        },
        new: {
            label: 'New',
            icon: '+'
        },
        blocked: {
            label: 'Blocked',
            icon: '✕'
        }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-black text-xs font-light uppercase tracking-widest hover:border-black transition-colors">
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

export default CustomerStatusBadge;
