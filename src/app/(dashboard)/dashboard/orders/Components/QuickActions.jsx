import React from 'react';

const QuickActions = () => {
    const actions = [
        {
            id: 1,
            title: 'Create New Order',
            description: 'Manually create a new order',
            icon: '➕',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            hoverColor: 'hover:bg-blue-100'
        },
        {
            id: 2,
            title: 'Bulk Update',
            description: 'Update multiple orders at once',
            icon: '📋',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            hoverColor: 'hover:bg-purple-100'
        },
        {
            id: 3,
            title: 'Generate Report',
            description: 'Create detailed order reports',
            icon: '📊',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            hoverColor: 'hover:bg-green-100'
        },
        {
            id: 4,
            title: 'Import Orders',
            description: 'Import orders from CSV/Excel',
            icon: '📥',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            hoverColor: 'hover:bg-orange-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {actions.map((action) => (
                <button
                    key={action.id}
                    className={`${action.bgColor} ${action.hoverColor} rounded-xl p-5 text-left transition-all duration-300 hover:shadow-md border border-transparent hover:border-gray-200`}
                >
                    <div className={`${action.iconColor} text-3xl mb-3`}>
                        {action.icon}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
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
