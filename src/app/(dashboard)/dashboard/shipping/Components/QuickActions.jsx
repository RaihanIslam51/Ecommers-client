import React from 'react';

/**
 * QuickActions Component - Quick action buttons for shipping
 */
const QuickActions = () => {
  const actions = [
    {
      icon: '📦',
      label: 'Create Shipment',
      description: 'Generate new shipping label',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-600 hover:to-indigo-700',
    },
    {
      icon: '📥',
      label: 'Bulk Import',
      description: 'Import orders from CSV',
      color: 'from-purple-500 to-pink-600',
      hoverColor: 'hover:from-purple-600 hover:to-pink-700',
    },
    {
      icon: '🖨️',
      label: 'Print Labels',
      description: 'Batch print shipping labels',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
    },
    {
      icon: '📊',
      label: 'Export Report',
      description: 'Download shipping reports',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'hover:from-orange-600 hover:to-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`bg-gradient-to-r ${action.color} ${action.hoverColor} text-white rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-sm mb-1">{action.label}</h3>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
