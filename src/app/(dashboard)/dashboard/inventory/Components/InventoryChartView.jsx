import React from 'react';
import { BarChart3, Package, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Inventory Chart View Component - Visual representation of inventory
 */
const InventoryChartView = ({ items }) => {
  // Group items by category
  const categoryData = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        total: 0,
        count: 0,
        lowStock: 0,
        outOfStock: 0
      };
    }
    acc[item.category].total += item.currentStock;
    acc[item.category].count += 1;
    if (item.currentStock === 0) acc[item.category].outOfStock += 1;
    else if (item.currentStock <= item.minStock) acc[item.category].lowStock += 1;
    return acc;
  }, {});

  const maxTotal = Math.max(...Object.values(categoryData).map(d => d.total), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <BarChart3 className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Inventory by Category</h3>
          <p className="text-sm text-gray-500">Stock levels across different categories</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(categoryData).map(([category, data]) => {
          const percentage = (data.total / maxTotal) * 100;
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">{category}</h4>
                  <span className="text-sm text-gray-500">({data.count} items)</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{data.total}</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3 text-sm">
                  <span className={`font-medium ${percentage > 30 ? 'text-white' : 'text-gray-700'}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-4 text-xs">
                {data.outOfStock > 0 && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{data.outOfStock} out of stock</span>
                  </div>
                )}
                {data.lowStock > 0 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>{data.lowStock} low stock</span>
                  </div>
                )}
                {data.outOfStock === 0 && data.lowStock === 0 && (
                  <div className="flex items-center gap-1 text-black">
                    <Package className="w-3 h-3" />
                    <span>All items in stock</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="py-16 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-500">Add inventory items to see chart data.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryChartView;
