import React from 'react';
import { Folder, Package, TrendingUp, Archive } from 'lucide-react';

/**
 * Category Stats Component - Displays overview statistics
 */
const CategoryStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Categories',
      value: stats?.total || 0,
      icon: Folder,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Active Categories',
      value: stats?.active || 0,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Inactive Categories',
      value: stats?.inactive || 0,
      icon: Archive,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
            </div>
            <div className={`${stat.iconBg} p-4 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
