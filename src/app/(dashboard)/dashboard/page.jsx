'use client';
import React from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiPackage,
  FiClock
} from 'react-icons/fi';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$54,234',
      change: '+12.5%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: '2,543',
      change: '+8.2%',
      trend: 'up',
      icon: FiShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Customers',
      value: '1,842',
      change: '+23.1%',
      trend: 'up',
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Products Sold',
      value: '6,789',
      change: '-3.4%',
      trend: 'down',
      icon: FiPackage,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Anderson',
      product: 'Wireless Headphones',
      amount: '$234.50',
      status: 'completed',
      time: '2 min ago'
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Williams',
      product: 'Smart Watch Pro',
      amount: '$299.99',
      status: 'processing',
      time: '15 min ago'
    },
    {
      id: '#ORD-003',
      customer: 'Michael Brown',
      product: 'Premium Wallet',
      amount: '$49.99',
      status: 'pending',
      time: '1 hour ago'
    },
    {
      id: '#ORD-004',
      customer: 'Emma Davis',
      product: 'Running Shoes',
      amount: '$89.99',
      status: 'completed',
      time: '2 hours ago'
    }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234, revenue: '$29,988', trend: 'up' },
    { name: 'Smart Watch Pro', sales: 156, revenue: '$46,799', trend: 'up' },
    { name: 'Running Shoes Ultra', sales: 445, revenue: '$40,036', trend: 'up' },
    { name: 'Premium Wallet', sales: 89, revenue: '$4,449', trend: 'down' },
    { name: 'Designer Sunglasses', sales: 123, revenue: '$19,679', trend: 'up' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
      processing: 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20',
      pending: 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? FiArrowUp : FiArrowDown;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiMoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <div className="flex items-center">
                  <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Monthly revenue trends</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg">
                Monthly
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Weekly
              </button>
            </div>
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
              const values = [65, 78, 85, 72, 90, 88];
              return (
                <div key={month} className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-12">{month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${values[index]}%` }}
                    >
                      <span className="text-xs font-semibold text-white">
                        ${(values[index] * 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                  <div className="flex items-center justify-end mt-1">
                    {product.trend === 'up' ? (
                      <FiArrowUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <FiArrowDown className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Latest customer orders</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all">
              View All Orders
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-sm">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-semibold text-gray-900 mr-2">{order.customer}</p>
                      <span className="text-xs text-gray-500">• {order.id}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.product}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                    <div className="flex items-center mt-1">
                      <FiClock className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
