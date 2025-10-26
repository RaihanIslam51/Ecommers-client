import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Package } from 'lucide-react';

/**
 * Low Stock Alert Component - Shows items that need attention
 */
const LowStockAlert = ({ items, onRestock }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Low Stock Alert
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {items.length} item{items.length > 1 ? 's' : ''} need restocking
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.slice(0, 5).map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Stock: {item.currentStock} / Min: {item.minStock}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRestock(item)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
          {items.length > 5 && (
            <p className="text-xs text-gray-500 mt-3">
              And {items.length - 5} more items...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
