import React from 'react';
import { Package, AlertTriangle, TrendingDown, AlertCircle } from 'lucide-react';

/**
 * Inventory Card Component - Displays product inventory details
 */
const InventoryCard = ({ item, onEdit, onRestock, onView }) => {
  const { name, sku, image, currentStock, minStock, maxStock, status, category, location } = item;

  const getStockStatus = () => {
    if (currentStock === 0) return { label: 'Out of Stock', color: 'red', icon: AlertCircle };
    if (currentStock <= minStock) return { label: 'Low Stock', color: 'orange', icon: AlertTriangle };
    if (currentStock >= maxStock) return { label: 'Overstock', color: 'blue', icon: TrendingDown };
    return { label: 'In Stock', color: 'green', icon: Package };
  };

  const stockStatus = getStockStatus();
  const stockPercentage = maxStock > 0 ? (currentStock / maxStock) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header with Image */}
      <div className="relative h-48 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1 ${
            stockStatus.color === 'red' ? 'bg-red-100/90 text-red-700 border border-red-200' :
            stockStatus.color === 'orange' ? 'bg-orange-100/90 text-orange-700 border border-orange-200' :
            stockStatus.color === 'blue' ? 'bg-blue-100/90 text-blue-700 border border-blue-200' :
            'bg-green-100/90 text-green-700 border border-green-200'
          }`}>
            <stockStatus.icon className="w-3 h-3" />
            {stockStatus.label}
          </span>
        </div>

        {/* SKU Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/80 text-white backdrop-blur-sm">
            SKU: {sku}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{category}</p>

        {/* Stock Info */}
        <div className="space-y-3 mb-4">
          {/* Stock Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Current Stock</span>
              <span className="font-bold text-gray-900">{currentStock} / {maxStock}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  stockStatus.color === 'red' ? 'bg-red-500' :
                  stockStatus.color === 'orange' ? 'bg-orange-500' :
                  stockStatus.color === 'blue' ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Stock Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-500 text-xs">Min Stock</p>
              <p className="font-semibold text-gray-900">{minStock}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-semibold text-gray-900 truncate">{location || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(item)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => onRestock(item)}
            className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
          >
            Restock
          </button>
          <button
            onClick={() => onEdit(item)}
            className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
