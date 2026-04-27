import React from 'react';

const QuickActions = () => {
    const actions = [
        {
            id: 1,
            title: 'Create New Order',
            description: 'Manually create a new order',
            icon: '➕'
        },
        {
            id: 2,
            title: 'Bulk Update',
            description: 'Update multiple orders at once',
            icon: '📋'
        },
        {
            id: 3,
            title: 'Generate Report',
            description: 'Create detailed order reports',
            icon: '📊'
        },
        {
            id: 4,
            title: 'Import Orders',
            description: 'Import orders from CSV/Excel',
            icon: '📥'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {actions.map((action) => (
                <button
                    key={action.id}
                    className="bg-white border border-gray-200 hover:border-black p-6 text-left transition-all duration-300 font-light"
                >
                    <div className="text-3xl mb-3 opacity-60">
                        {action.icon}
                    </div>
                    <h4 className="font-light text-black text-sm mb-2 tracking-wide">
                        {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 font-light">
                        {action.description}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default QuickActions;
