import React from 'react';

const QuickActions = () => {
    const actions = [
        {
            id: 1,
            title: 'Create New Order',
            description: 'Manually create a new order',
            icon: '➕',
            bgColor: 'bg-white',
            iconColor: 'text-gray-700',
            hoverColor: 'hover:bg-gray-50'
        },
        {
            id: 2,
            title: 'Bulk Update',
            description: 'Update multiple orders at once',
            icon: '📋',
            bgColor: 'bg-white',
            iconColor: 'text-gray-700',
            hoverColor: 'hover:bg-gray-50'
        },
        {
            id: 3,
            title: 'Generate Report',
            description: 'Create detailed order reports',
            icon: '📊',
            bgColor: 'bg-white',
            iconColor: 'text-gray-700',
            hoverColor: 'hover:bg-gray-50'
        },
        {
            id: 4,
            title: 'Import Orders',
            description: 'Import orders from CSV/Excel',
            icon: '📥',
            bgColor: 'bg-white',
            iconColor: 'text-gray-700',
            hoverColor: 'hover:bg-gray-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {actions.map((action) => (
                <button
                    key={action.id}
                    className={`${action.bgColor} ${action.hoverColor} rounded-xl p-5 text-left transition-all duration-300 hover:shadow-md border border-gray-100`}
                >
                    <div className={`${action.iconColor} text-3xl mb-3`}>
                        {action.icon}
                    </div>
                    <h4 className="font-semibold text-black text-sm mb-1">
                        {action.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                        {action.description}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
