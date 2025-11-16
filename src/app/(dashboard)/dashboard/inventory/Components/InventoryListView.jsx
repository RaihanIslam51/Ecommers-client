import React from 'react';
import { Package, AlertTriangle, Pencil, Eye } from 'lucide-react';

/**
 * Inventory List View Component - Table view for inventory items
 */
const InventoryListView = ({ items, onEdit, onRestock, onView }) => {
  const getStockStatusBadge = (item) => {
    const { currentStock, minStock, maxStock } = item;
    
    if (currentStock === 0) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Out of Stock</span>;
    }
    if (currentStock <= minStock) {
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Low Stock</span>;
    }
    if (currentStock >= maxStock) {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Overstock</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">In Stock</span>;
  };

  const getStockBarColor = (item) => {
    const { currentStock, minStock, maxStock } = item;
    
    if (currentStock === 0) return 'bg-red-500';
    if (currentStock <= minStock) return 'bg-orange-500';
    if (currentStock >= maxStock) return 'bg-green-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => {
              const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;
              
              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-mono text-gray-600">{item.sku}</span>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">{item.category}</span>
                  </td>

                  {/* Stock Level */}
                  <td className="px-6 py-4">
                    <div className="w-32 mx-auto">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-900">{item.currentStock}</span>
                        <span className="text-gray-500">{item.maxStock}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getStockBarColor(item)}`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {getStockStatusBadge(item)}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">{item.location || 'N/A'}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRestock(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Restock"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-500">Try adjusting your filters or add new inventory.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryListView;
