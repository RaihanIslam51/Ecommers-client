import React from 'react';
import ShippingStatusBadge from './ShippingStatusBadge';
import ShippingTableRow from './ShippingTableRow';

/**
 * ShippingTable Component - Display shipping orders in table
 */
const ShippingTable = ({ orders = [], onViewDetails, onUpdateStatus }) => {
  // Sample data if no orders provided
  const sampleOrders = [
    {
      id: 'ORD-001',
      trackingNo: 'TRK-2024-001234',
      customer: 'Raihan Islam',
      destination: 'Dhaka, Bangladesh',
      carrier: 'Sundarban Courier',
      status: 'transit',
      date: '2024-10-23',
      estimatedDelivery: '2024-10-25',
      items: 3,
      weight: '2.5 kg',
    },
    {
      id: 'ORD-002',
      trackingNo: 'TRK-2024-001235',
      customer: 'Fahim Ahmed',
      destination: 'Chittagong, Bangladesh',
      carrier: 'SA Paribahan',
      status: 'delivered',
      date: '2024-10-20',
      estimatedDelivery: '2024-10-22',
      items: 1,
      weight: '1.2 kg',
    },
    {
      id: 'ORD-003',
      trackingNo: 'TRK-2024-001236',
      customer: 'Sadia Rahman',
      destination: 'Sylhet, Bangladesh',
      carrier: 'Pathao',
      status: 'pending',
      date: '2024-10-24',
      estimatedDelivery: '2024-10-26',
      items: 5,
      weight: '3.8 kg',
    },
    {
      id: 'ORD-004',
      trackingNo: 'TRK-2024-001237',
      customer: 'Tanvir Hossain',
      destination: 'Rajshahi, Bangladesh',
      carrier: 'eCourier',
      status: 'processing',
      date: '2024-10-24',
      estimatedDelivery: '2024-10-27',
      items: 2,
      weight: '1.8 kg',
    },
    {
      id: 'ORD-005',
      trackingNo: 'TRK-2024-001238',
      customer: 'Nusrat Jahan',
      destination: 'Khulna, Bangladesh',
      carrier: 'Redx',
      status: 'failed',
      date: '2024-10-21',
      estimatedDelivery: '2024-10-23',
      items: 1,
      weight: '0.8 kg',
    },
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Order Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Carrier
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Delivery
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayOrders.map((order) => (
              <ShippingTableRow 
                key={order.id} 
                order={order}
                onViewDetails={onViewDetails}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingTable;
