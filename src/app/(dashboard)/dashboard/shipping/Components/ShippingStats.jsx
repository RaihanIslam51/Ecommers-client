import React from 'react';

/**
 * ShippingStats Component - Display shipping statistics
 */
const ShippingStats = ({ stats = [] }) => {
  const defaultStats = [
    { label: 'Pending Shipments', value: 45, color: 'yellow', icon: '📦' },
    { label: 'In Transit', value: 128, color: 'blue', icon: '🚚' },
    { label: 'Delivered', value: 892, color: 'green', icon: '✅' },
    { label: 'Failed Delivery', value: 12, color: 'red', icon: '❌' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayStats.map((stat, index) => (
        <div 
          key={index} 
          className={`${colorClasses[stat.color]} border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          <p className="text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ShippingStats;
