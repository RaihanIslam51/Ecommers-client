import React from 'react';
import ShippingStatusBadge from './ShippingStatusBadge';

/**
 * ShippingDetailsModal Component - Show detailed shipping information
 */
const ShippingDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const trackingHistory = [
    { date: '2024-10-24 14:30', status: 'Out for Delivery', location: 'Dhaka Delivery Hub' },
    { date: '2024-10-24 09:15', status: 'In Transit', location: 'Regional Sorting Center' },
    { date: '2024-10-23 18:45', status: 'Package Received', location: 'Origin Facility' },
    { date: '2024-10-23 16:20', status: 'Label Created', location: 'Warehouse' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Shipping Details</h2>
            <p className="text-blue-100 text-sm mt-1">{order.trackingNo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            ✖️
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Order ID</p>
              <p className="text-lg font-bold text-gray-900">{order.id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Status</p>
              <ShippingStatusBadge status={order.status} />
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>👤</span> Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700"><span className="font-semibold">Name:</span> {order.customer}</p>
                <p className="text-gray-700"><span className="font-semibold">Destination:</span> {order.destination}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📦</span> Package Details
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700"><span className="font-semibold">Items:</span> {order.items}</p>
                <p className="text-gray-700"><span className="font-semibold">Weight:</span> {order.weight}</p>
                <p className="text-gray-700"><span className="font-semibold">Carrier:</span> {order.carrier}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🕐</span> Tracking History
            </h3>
            <div className="space-y-4">
              {trackingHistory.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index === 0 ? '🚚' : '📍'}
                    </div>
                    {index !== trackingHistory.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-gray-900">{event.status}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
              Print Label
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailsModal;
