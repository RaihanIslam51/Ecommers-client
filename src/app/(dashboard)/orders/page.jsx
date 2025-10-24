'use client';
import React, { useState } from 'react';
import { 
  FiShoppingCart, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage,
  FiFilter,
  FiDownload,
  FiEye,
  FiMoreVertical,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck
} from 'react-icons/fi';

const OrdersPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data - replace with your actual data
  const stats = [
    {
      title: 'Total Orders',
      value: '2,543',
      change: '+12.5%',
      icon: FiShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2%',
      icon: FiDollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: '124',
      change: '-3.1%',
      icon: FiClock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Completed',
      value: '2,341',
      change: '+15.3%',
      icon: FiCheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const orders = [
    {
      id: '#ORD-2024-001',
      customer: 'John Anderson',
      email: 'john@example.com',
      date: 'Oct 24, 2025',
      amount: '$234.50',
      status: 'completed',
      items: 3,
      payment: 'Credit Card'
    },
    {
      id: '#ORD-2024-002',
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      date: 'Oct 24, 2025',
      amount: '$145.00',
      status: 'processing',
      items: 2,
      payment: 'PayPal'
    },
    {
      id: '#ORD-2024-003',
      customer: 'Michael Brown',
      email: 'michael@example.com',
      date: 'Oct 23, 2025',
      amount: '$567.80',
      status: 'shipped',
      items: 5,
      payment: 'Credit Card'
    },
    {
      id: '#ORD-2024-004',
      customer: 'Emma Davis',
      email: 'emma@example.com',
      date: 'Oct 23, 2025',
      amount: '$89.99',
      status: 'pending',
      items: 1,
      payment: 'Cash on Delivery'
    },
    {
      id: '#ORD-2024-005',
      customer: 'James Wilson',
      email: 'james@example.com',
      date: 'Oct 22, 2025',
      amount: '$423.20',
      status: 'completed',
      items: 4,
      payment: 'Debit Card'
    },
    {
      id: '#ORD-2024-006',
      customer: 'Olivia Martinez',
      email: 'olivia@example.com',
      date: 'Oct 22, 2025',
      amount: '$312.00',
      status: 'cancelled',
      items: 2,
      payment: 'Credit Card'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
      processing: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20',
      shipped: 'bg-purple-100 text-purple-700 ring-1 ring-purple-600/20',
      pending: 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20',
      cancelled: 'bg-red-100 text-red-700 ring-1 ring-red-600/20'
    };

    const icons = {
      completed: FiCheckCircle,
      processing: FiClock,
      shipped: FiTruck,
      pending: FiClock,
      cancelled: FiXCircle
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Track and manage all your customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <FiFilter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all shadow-sm">
            <FiDownload className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} <span className="font-normal text-gray-500">vs last month</span>
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
                All
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
                Pending
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded-lg transition-colors">
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mr-3">
                        <span className="text-white font-semibold text-sm">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{order.items} items</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">1-6</span> of <span className="font-semibold text-gray-900">2,543</span> orders
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:shadow-lg transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;