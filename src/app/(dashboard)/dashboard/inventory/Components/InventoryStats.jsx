import React from 'react';
import { Package, AlertTriangle, TrendingUp, Box } from 'lucide-react';

/**
 * Inventory Stats Component - Displays overview statistics
 */
const InventoryStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      iconBg: 'bg-green-100',
      iconColor: 'text-black',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStock || 0,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      trend: '+3%',
      trendUp: true
    },
    {
      title: 'Total Stock Value',
      value: `$${(stats?.totalValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-black',
      trend: '+8%',
      trendUp: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${stat.iconBg} p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            {stat.trend && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stat.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;
