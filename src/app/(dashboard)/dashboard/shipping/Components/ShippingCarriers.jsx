import React from 'react';

/**
 * ShippingCarriers Component - Display available carriers and their performance
 */
const ShippingCarriers = () => {
  const carriers = [
    {
      name: 'Sundarban Courier',
      logo: '🚚',
      totalShipments: 456,
      onTime: 94,
      avgDeliveryTime: '2.3 days',
      rating: 4.8,
      color: 'blue',
    },
    {
      name: 'Pathao',
      logo: '🏍️',
      totalShipments: 312,
      onTime: 96,
      avgDeliveryTime: '1.8 days',
      rating: 4.9,
      color: 'red',
    },
    {
      name: 'eCourier',
      logo: '📮',
      totalShipments: 234,
      onTime: 92,
      avgDeliveryTime: '2.5 days',
      rating: 4.7,
      color: 'green',
    },
    {
      name: 'Redx',
      logo: '🚛',
      totalShipments: 189,
      onTime: 91,
      avgDeliveryTime: '2.7 days',
      rating: 4.6,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-rose-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🚛</span> Shipping Carriers Performance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {carriers.map((carrier, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-linear-to-br ${colorClasses[carrier.color]} flex items-center justify-center text-2xl`}>
                {carrier.logo}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{carrier.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span className="text-xs font-semibold text-gray-700">{carrier.rating}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Shipments</span>
                <span className="text-sm font-bold text-gray-900">{carrier.totalShipments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">On-Time Delivery</span>
                <span className="text-sm font-bold text-black">{carrier.onTime}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg. Delivery</span>
                <span className="text-sm font-bold text-gray-900">{carrier.avgDeliveryTime}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-linear-to-r ${colorClasses[carrier.color]} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${carrier.onTime}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingCarriers;
