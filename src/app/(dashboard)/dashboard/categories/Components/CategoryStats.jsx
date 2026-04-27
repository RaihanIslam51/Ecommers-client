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
      iconColor: 'text-black'
    },
    {
      title: 'Active Categories',
      value: stats?.active || 0,
      icon: TrendingUp,
      iconColor: 'text-black'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      iconColor: 'text-black'
    },
    {
      title: 'Inactive Categories',
      value: stats?.inactive || 0,
      icon: Archive,
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 hover:border-black p-6 transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-light text-gray-600 mb-2 uppercase tracking-widest">
                {stat.title}
              </p>
              <h3 className="text-3xl font-light text-black">
                {stat.value}
              </h3>
            </div>
            <div className="p-3 opacity-60">
              <stat.icon className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryStats;
