import React from 'react';
import ShippingStatusBadge from './ShippingStatusBadge';

/**
 * ShippingTableRow Component - Individual row in shipping table
 */
const ShippingTableRow = ({ order, onViewDetails, onUpdateStatus }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">{order.id}</span>
          <span className="text-xs text-gray-500 mt-0.5">{order.trackingNo}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">📦 {order.items} items</span>
            <span className="text-xs text-gray-400">⚖️ {order.weight}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {order.customer.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-900">{order.customer}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📍</span>
          <span className="text-sm text-gray-700">{order.destination}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <span className="text-sm">🚚</span>
          </div>
          <span className="text-sm font-medium text-gray-700">{order.carrier}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <ShippingStatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Est. Delivery</span>
          <span className="text-sm font-semibold text-gray-900 mt-0.5">
            {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onViewDetails && onViewDetails(order)}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            👁️
          </button>
          <button
            onClick={() => onUpdateStatus && onUpdateStatus(order)}
            className="px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Update Status"
          >
            ✏️
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Track Package"
          >
            🔍
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ShippingTableRow;
