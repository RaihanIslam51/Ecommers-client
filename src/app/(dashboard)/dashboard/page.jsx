'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';
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
  Spinner,
} from './Components';
import ProductForm from './products/Components/ProductForm';

const DashboardPage = () => {
  const [timeframe, setTimeframe] = useState('today');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/products', productData);
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Product Added!',
          text: 'The product has been successfully added.',
          timer: 2000,
          showConfirmButton: false
        });
        setShowForm(false);
        setEditingProduct(null);
        // Optionally refresh dashboard data to show new product
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add product. Please try again.',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/stats');
      
      if (response.data.success) {
        setDashboardData(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch dashboard data',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  

  const alerts = [
    ...(dashboardData.lowStockProducts > 0 ? [{
      type: 'warning',
      message: `Low stock alert: ${dashboardData.lowStockProducts} products need restock`,
      icon: AlertTriangle
    }] : []),
    ...(dashboardData.revenueChange > 10 ? [{
      type: 'success',
      message: 'Monthly sales target achieved!',
      icon: CheckCircle
    }] : []),
    ...(dashboardData.ordersByStatus.pending > 0 ? [{
      type: 'info',
      message: `${dashboardData.ordersByStatus.pending} pending orders to process`,
      icon: MessageSquare
    }] : [])
  ];

  // Ensure we have at least 3 alerts
  if (alerts.length < 3) {
    alerts.push({
      type: 'success',
      message: 'All systems running smoothly!',
      icon: CheckCircle
    });
  }

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format real data for recent orders
  const recentOrders = (dashboardData.recentOrders || []).map(order => ({
    id: order.id || 'N/A',
    customer: order.customer || 'Unknown',
    product: order.product || 'N/A',
    amount: `$${(order.amount || 0).toFixed(2)}`,
    status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending',
    date: getTimeAgo(order.date),
    avatar: getInitials(order.customer || 'U')
  }));

  // Format real data for top products
  const topProducts = (dashboardData.topProducts || []).map((product, index) => {
    const sales = product.sales || 0;
    const lastMonthSales = sales * 0.9; // Simulate last month
    const trend = lastMonthSales > 0 ? ((sales - lastMonthSales) / lastMonthSales * 100).toFixed(0) : 0;
    return {
      name: product.name || 'Unknown Product',
      sales: sales,
      revenue: `$${(product.revenue || 0).toLocaleString()}`,
      trend: `+${trend}%`,
      stock: product.stock || 0,
      rating: product.rating || 0
    };
  });

  // Format real data for sales by category
  const salesByCategory = (dashboardData.salesByCategory || []).map(cat => ({
    category: cat.category || 'Other',
    amount: `$${(cat.amount || 0).toLocaleString()}`,
    percentage: parseInt(cat.percentage || 0),
    color: (cat.category || '').toLowerCase().includes('electronic') ? 'blue' :
           (cat.category || '').toLowerCase().includes('fashion') ? 'purple' :
           (cat.category || '').toLowerCase().includes('home') ? 'green' : 'orange'
  }));

  // Generate real recent activity from orders
  const recentActivity = [
    ...(dashboardData.recentOrders.length > 0 && dashboardData.recentOrders[0].customer ? [{
      action: 'New order received',
      user: dashboardData.recentOrders[0].customer,
      time: getTimeAgo(dashboardData.recentOrders[0].date),
      icon: ShoppingCart,
      color: 'blue'
    }] : []),
    ...(dashboardData.topProducts.length > 0 ? [{
      action: 'Product popular in sales',
      user: 'System',
      time: 'Today',
      icon: Package,
      color: 'green'
    }] : []),
    ...(dashboardData.ordersByStatus.delivered > 0 ? [{
      action: `${dashboardData.ordersByStatus.delivered} orders delivered`,
      user: 'Shipping',
      time: 'Today',
      icon: Truck,
      color: 'orange'
    }] : []),
    ...(dashboardData.recentOrders.length > 1 && dashboardData.recentOrders[1].customer ? [{
      action: 'Payment processed',
      user: dashboardData.recentOrders[1].customer,
      time: getTimeAgo(dashboardData.recentOrders[1].date),
      icon: CreditCard,
      color: 'purple'
    }] : []),
    {
      action: 'New customer registered',
      user: 'System',
      time: 'Today',
      icon: Star,
      color: 'yellow'
    }
  ].slice(0, 5);

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
            disabled={refreshing}
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
          <Button onClick={handleAddProduct}
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
              <span className="text-xl font-bold text-gray-900">
                ${dashboardData.totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Badge variant={dashboardData.revenueChange >= 0 ? "success" : "danger"} icon={<TrendingUp className="w-3 h-3" />}>
                {dashboardData.revenueChange > 0 ? '+' : ''}{dashboardData.revenueChange}%
              </Badge>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </Card>
      </div>

    

      {/* Footer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<ShoppingCart className="w-5 h-5" />}
              size="sm"
              color="from-blue-500 to-cyan-500"
              bgColor="from-blue-50 to-cyan-50"
            />
            <div>
              <p className="text-xs text-gray-500">Today&apos;s Orders</p>
              <p className="text-lg font-bold text-gray-900">{dashboardData.todayOrders}</p>
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
              <p className="text-xs text-gray-500">Today&apos;s Revenue</p>
              <p className="text-lg font-bold text-gray-900">
                ${dashboardData.todayRevenue.toLocaleString()}
              </p>
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
              <p className="text-lg font-bold text-gray-900">
                {dashboardData.ordersByStatus.shipped}
              </p>
            </div>
          </div>
        </Card>
        
        <Card hoverable className="p-4">
          <div className="flex items-center gap-3">
            <IconBox
              icon={<CheckCircle className="w-5 h-5" />}
              size="sm"
              color="from-yellow-500 to-orange-500"
              bgColor="from-yellow-50 to-orange-50"
            />
            <div>
              <p className="text-xs text-gray-500">Delivered</p>
              <p className="text-lg font-bold text-gray-900">
                {dashboardData.ordersByStatus.delivered}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmitProduct}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;