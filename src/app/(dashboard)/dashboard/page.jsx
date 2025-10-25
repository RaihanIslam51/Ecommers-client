'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Users, CheckCircle ,
  DollarSign,
  TrendingUp,
  Package,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Star,
  Zap,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  Globe,
  CreditCard,
  Truck,
  AlertTriangle,
  MessageSquare,
  Bell,
  Settings,
  MoreVertical,
  Plus,
} from 'lucide-react';

// Import reusable components
import {
  Button,
  Badge,
  Card,
  Avatar,
  Alert,
  ProgressBar,
  Stat,
  Table,
  IconBox,
} from './Components';

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState('today');
  const [refreshing, setRefreshing] = useState(false);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      description: 'vs last period',
      target: '$50,000',
      percentage: 90
    },
    {
      title: 'Total Orders',
      value: '2,345',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      description: 'new this month',
      target: '3,000',
      percentage: 78
    },
    {
      title: 'Total Customers',
      value: '12,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      description: 'active users',
      target: '15,000',
      percentage: 82
    },
    {
      title: 'Active Products',
      value: '1,234',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      description: 'in stock',
      target: '1,500',
      percentage: 82
    }
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Wireless Headphones', amount: '$299', status: 'Completed', date: '2 min ago', avatar: 'JD' },
    { id: '#12344', customer: 'Jane Smith', product: 'Smart Watch', amount: '$499', status: 'Processing', date: '15 min ago', avatar: 'JS' },
    { id: '#12343', customer: 'Bob Johnson', product: 'Laptop Stand', amount: '$79', status: 'Pending', date: '1 hour ago', avatar: 'BJ' },
    { id: '#12342', customer: 'Alice Brown', product: 'USB-C Hub', amount: '$45', status: 'Completed', date: '2 hours ago', avatar: 'AB' },
    { id: '#12341', customer: 'Mike Wilson', product: 'Keyboard', amount: '$129', status: 'Shipped', date: '3 hours ago', avatar: 'MW' },
  ];

  const topProducts = [
    { name: 'Wireless Earbuds', sales: 1234, revenue: '$45,670', trend: '+12%', stock: 234, rating: 4.8 },
    { name: 'Smart Watch Pro', sales: 987, revenue: '$39,480', trend: '+8%', stock: 156, rating: 4.9 },
    { name: 'Laptop Stand', sales: 756, revenue: '$22,680', trend: '+15%', stock: 89, rating: 4.7 },
    { name: 'USB-C Cable', sales: 654, revenue: '$13,080', trend: '+5%', stock: 523, rating: 4.6 },
    { name: 'Phone Case', sales: 543, revenue: '$10,860', trend: '+3%', stock: 341, rating: 4.5 },
  ];

  const recentActivity = [
    { action: 'New order received', user: 'John Doe', time: '2 minutes ago', icon: ShoppingCart, color: 'blue' },
    { action: 'Product added to inventory', user: 'Admin', time: '15 minutes ago', icon: Package, color: 'green' },
    { action: 'Customer review posted', user: 'Jane Smith', time: '1 hour ago', icon: Star, color: 'yellow' },
    { action: 'Payment processed', user: 'System', time: '2 hours ago', icon: CreditCard, color: 'purple' },
    { action: 'Shipping notification sent', user: 'System', time: '3 hours ago', icon: Truck, color: 'orange' },
  ];

  const salesByCategory = [
    { category: 'Electronics', amount: '$25,430', percentage: 45, color: 'blue' },
    { category: 'Fashion', amount: '$15,670', percentage: 28, color: 'purple' },
    { category: 'Home & Garden', amount: '$8,920', percentage: 16, color: 'green' },
    { category: 'Sports', amount: '$6,210', percentage: 11, color: 'orange' },
  ];

  const alerts = [
    { type: 'warning', message: 'Low stock alert: 15 products need restock', icon: AlertTriangle },
    { type: 'success', message: 'Monthly sales target achieved!', icon: CheckCircle },
    { type: 'info', message: '3 pending customer reviews to moderate', icon: MessageSquare },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Page Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            icon={<RefreshCw className={refreshing ? 'animate-spin' : ''} />}
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            message={alert.message}
            icon={<alert.icon className="w-5 h-5" />}
          />
        ))}
      </div>

      {/* Enhanced Stats Grid with Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <Stat
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              description={stat.description}
            />
            <ProgressBar
              value={stat.percentage}
              color={stat.color.includes('blue') ? 'blue' : 
                     stat.color.includes('purple') ? 'purple' :
                     stat.color.includes('green') ? 'green' : 'orange'}
              showLabel
              label={`Target: ${stat.target}`}
              className="mt-3"
            />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Recent Orders - Larger Section */}
        <Card
          className="xl:col-span-2"
          title={
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </div>
          }
          subtitle="Latest transactions from your store"
          headerAction={
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          }
          bodyClassName="p-0"
        >
          <Table
            columns={[
              { key: 'id', label: 'Order ID', render: (row) => <span className="font-semibold text-gray-900">{row.id}</span> },
              { 
                key: 'customer', 
                label: 'Customer',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <Avatar initials={row.avatar} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{row.customer}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {row.date}
                      </p>
                    </div>
                  </div>
                )
              },
              { key: 'product', label: 'Product' },
              { key: 'amount', label: 'Amount', render: (row) => <span className="font-semibold">{row.amount}</span> },
              { 
                key: 'status', 
                label: 'Status',
                render: (row) => {
                  const variant = row.status === 'Completed' ? 'success' : 
                                 row.status === 'Processing' ? 'info' :
                                 row.status === 'Shipped' ? 'purple' : 'warning';
                  return <Badge variant={variant}>{row.status}</Badge>;
                }
              },
              { 
                key: 'action', 
                label: 'Action',
                render: () => (
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                )
              },
            ]}
            data={recentOrders}
            hoverable
          />
        </Card>

        {/* Recent Activity */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </div>
          }
          subtitle="Live updates"
          headerAction={<Bell className="w-5 h-5 text-gray-400" />}
        >
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const colorMap = {
                blue: { bg: 'bg-blue-50', icon: 'from-blue-500 to-cyan-500' },
                green: { bg: 'bg-green-50', icon: 'from-green-500 to-emerald-500' },
                yellow: { bg: 'bg-yellow-50', icon: 'from-yellow-500 to-orange-500' },
                purple: { bg: 'bg-purple-50', icon: 'from-purple-500 to-pink-500' },
                orange: { bg: 'bg-orange-50', icon: 'from-orange-500 to-red-500' },
              };
              const colors = colorMap[activity.color];
              
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <IconBox
                    icon={<activity.icon className="w-4 h-4" />}
                    size="sm"
                    color={colors.icon}
                    bgColor={colors.bg}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Top Products */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Products
            </div>
          }
          subtitle="Best selling items"
          headerAction={
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <div className="space-y-3 sm:space-y-4">
            {topProducts.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 active:from-blue-100 active:to-indigo-100 transition-all duration-200 cursor-pointer group touch-manipulation border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-bold text-gray-900 text-sm">{product.revenue}</p>
                  <Badge variant="success" size="sm" className="mt-1">{product.trend}</Badge>
                  <p className="text-xs text-gray-400 mt-1">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sales by Category */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Sales by Category
            </div>
          }
          subtitle="Revenue breakdown"
          headerAction={
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          }
        >
          <div className="space-y-4">
            {salesByCategory.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={category.color} dot size="sm">{category.category}</Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{category.amount}</span>
                    <span className="text-xs text-gray-500 ml-2">({category.percentage}%)</span>
                  </div>
                </div>
                <ProgressBar
                  value={category.percentage}
                  color={category.color}
                  size="lg"
                />
              </div>
            ))}
          </div>
          
          {/* Total Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              <span className="text-xl font-bold text-gray-900">$56,230</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant="success" icon={<TrendingUp className="w-3 h-3" />}>
                +12.5%
              </Badge>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-0 shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
                <Zap className="w-6 h-6" />
                Quick Actions
              </h2>
              <p className="text-blue-100 mt-1 text-sm">Manage your store efficiently</p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl p-4 transition-all duration-200 text-left group touch-manipulation active:scale-95">
              <IconBox
                icon={<Package className="w-6 h-6" />}
                size="lg"
                bgColor="bg-white/20"
                className="mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-semibold mb-1 text-white">Add Product</h3>
              <p className="text-sm text-blue-100">Create new listing</p>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl p-4 transition-all duration-200 text-left group touch-manipulation active:scale-95">
              <IconBox
                icon={<ShoppingCart className="w-6 h-6" />}
                size="lg"
                bgColor="bg-white/20"
                className="mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-semibold mb-1 text-white">View Orders</h3>
              <p className="text-sm text-blue-100">Manage orders</p>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl p-4 transition-all duration-200 text-left group touch-manipulation active:scale-95">
              <IconBox
                icon={<Users className="w-6 h-6" />}
                size="lg"
                bgColor="bg-white/20"
                className="mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-semibold mb-1 text-white">Customers</h3>
              <p className="text-sm text-blue-100">View customer list</p>
            </button>
            
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl p-4 transition-all duration-200 text-left group touch-manipulation active:scale-95">
              <IconBox
                icon={<BarChart3 className="w-6 h-6" />}
                size="lg"
                bgColor="bg-white/20"
                className="mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-semibold mb-1 text-white">Analytics</h3>
              <p className="text-sm text-blue-100">View reports</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<Globe className="w-5 h-5" />}
              size="sm"
              color="from-blue-500 to-cyan-500"
              bgColor="from-blue-50 to-cyan-50"
            />
            <div>
              <p className="text-xs text-gray-500">Website Visits</p>
              <p className="text-lg font-bold text-gray-900">45.2K</p>
            </div>
          </div>
        </Card>
        
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<CreditCard className="w-5 h-5" />}
              size="sm"
              color="from-green-500 to-emerald-500"
              bgColor="from-green-50 to-emerald-50"
            />
            <div>
              <p className="text-xs text-gray-500">Total Paid</p>
              <p className="text-lg font-bold text-gray-900">$42.3K</p>
            </div>
          </div>
        </Card>
        
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<Truck className="w-5 h-5" />}
              size="sm"
              color="from-purple-500 to-pink-500"
              bgColor="from-purple-50 to-pink-50"
            />
            <div>
              <p className="text-xs text-gray-500">In Shipping</p>
              <p className="text-lg font-bold text-gray-900">124</p>
            </div>
          </div>
        </Card>
        
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<Star className="w-5 h-5" />}
              size="sm"
              color="from-yellow-500 to-orange-500"
              bgColor="from-yellow-50 to-orange-50"
            />
            <div>
              <p className="text-xs text-gray-500">Avg Rating</p>
              <p className="text-lg font-bold text-gray-900">4.8/5.0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;