import React from 'react';

/**
 * ShippingStatusBadge Component - Display shipping status with colors
 */
const ShippingStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: '⏳',
    },
    processing: {
      label: 'Processing',
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: '⚙️',
    },
    transit: {
      label: 'In Transit',
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-300',
      icon: '🚚',
    },
    delivered: {
      label: 'Delivered',
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: '✅',
    },
    failed: {
      label: 'Failed',
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: '❌',
    },
    returned: {
      label: 'Returned',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: '↩️',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ShippingStatusBadge;
