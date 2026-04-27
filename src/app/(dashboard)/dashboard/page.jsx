'use client';

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';
import {
  ShoppingCart,
  Users,
  CheckCircle,
  TrendingUp,
  Package,
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Star,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  CreditCard,
  Truck,
  AlertTriangle,
  MessageSquare,
  Bell,
  MoreVertical,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import ProductForm from './products/Components/ProductForm';

/* ─────────────────────────────────────────────────────────────
   DESIGN-SYSTEM COMPONENTS  (Tailwind only, no extra UI lib)
───────────────────────────────────────────────────────────── */

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-100 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
    <div>
      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`px-5 py-4 ${className}`}>{children}</div>
);

const KpiCard = ({ label, value, badge, badgeUp, sub }) => (
  <div className="bg-white p-5">
    <p className="text-[10px] tracking-widest uppercase text-gray-400 mb-3">{label}</p>
    <p className="text-3xl font-light tracking-tight text-gray-900">{value}</p>
    {(badge || sub) && (
      <div className="flex items-center gap-2 mt-2">
        {badge && (
          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded gap-0.5 ${
            badgeUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {badgeUp
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />}
            {badge}
          </span>
        )}
        {sub && <span className="text-xs text-gray-400">{sub}</span>}
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Pending:    'bg-amber-50 text-amber-700',
    Processing: 'bg-violet-50 text-violet-700',
    Shipped:    'bg-sky-50 text-sky-700',
    Completed:  'bg-emerald-50 text-emerald-700',
    Delivered:  'bg-emerald-50 text-emerald-700',
    Cancelled:  'bg-red-50 text-red-600',
  };
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
};

const Ava = ({ initials }) => (
  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500 flex-shrink-0">
    {initials}
  </div>
);

const ProgressBar = ({ value }) => (
  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full bg-gray-900 rounded-full" style={{ width: `${value}%` }} />
  </div>
);

const AlertStrip = ({ type, message, Icon }) => {
  const cls = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info:    'bg-sky-50 border-sky-200 text-sky-800',
  }[type] ?? 'bg-gray-50 border-gray-200 text-gray-700';
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${cls}`}>
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};

const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
  >
    {children}
  </button>
);

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    <p className="text-sm text-gray-400">Loading dashboard…</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const [refreshing,    setRefreshing]    = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [showForm,      setShowForm]      = useState(false);
  const [editingProduct,setEditingProduct]= useState(null);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  /* handlers */
  const handleAddProduct  = () => { setEditingProduct(null); setShowForm(true); };
  const handleCancelForm  = () => { setShowForm(false); setEditingProduct(null); };

  const handleSubmitProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post('/products', productData);
      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'Product Added!', text: 'Successfully added.', timer: 2000, showConfirmButton: false });
        setShowForm(false);
        setEditingProduct(null);
        fetchDashboardData();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to add product.', confirmButtonColor: '#0a0a0a' });
    } finally { setIsSubmitting(false); }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/dashboard/stats');
      if (res.data.success) setDashboardData(res.data.stats);
    } catch {
      Swal.fire({ title: 'Error!', text: 'Failed to fetch dashboard data', icon: 'error', confirmButtonColor: '#0a0a0a' });
    } finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  /* early returns */
  if (loading) return <Loader />;
  if (!dashboardData) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-sm text-gray-400">No dashboard data available</p>
      <button onClick={fetchDashboardData} className="text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
        Retry
      </button>
    </div>
  );

  /* helpers */
  const getTimeAgo = (d) => {
    const s = Math.floor((new Date() - new Date(d)) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };
  const getInitials = (n) => {
    if (!n) return 'U';
    const p = n.split(' ');
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : n.slice(0, 2).toUpperCase();
  };

  /* derived data */
  const alerts = [
    ...(dashboardData.lowStockProducts > 0
      ? [{ type: 'warning', message: `Low stock: ${dashboardData.lowStockProducts} products need restock`, Icon: AlertTriangle }]
      : []),
    ...(dashboardData.revenueChange > 10
      ? [{ type: 'success', message: 'Monthly sales target achieved!', Icon: CheckCircle }]
      : []),
    ...(dashboardData.ordersByStatus.pending > 0
      ? [{ type: 'info', message: `${dashboardData.ordersByStatus.pending} pending orders to process`, Icon: MessageSquare }]
      : []),
  ];
  while (alerts.length < 3) alerts.push({ type: 'success', message: 'All systems running smoothly!', Icon: CheckCircle });

  const recentOrders = (dashboardData.recentOrders || []).map(o => ({
    id:       o.id || 'N/A',
    customer: o.customer || 'Unknown',
    product:  o.product  || 'N/A',
    amount:   `$${(o.amount || 0).toFixed(2)}`,
    status:   o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Pending',
    date:     getTimeAgo(o.date),
    avatar:   getInitials(o.customer || 'U'),
  }));

  const topProducts = (dashboardData.topProducts || []).map((p) => {
    const s = p.sales || 0;
    const trend = s > 0 ? `+${((s - s * 0.9) / (s * 0.9) * 100).toFixed(0)}%` : '+0%';
    return { name: p.name || 'Unknown', sales: s, revenue: `$${(p.revenue || 0).toLocaleString()}`, trend, stock: p.stock || 0, rating: p.rating || 0 };
  });

  const salesByCategory = (dashboardData.salesByCategory || []).map(c => ({
    category:   c.category  || 'Other',
    amount:     `$${(c.amount || 0).toLocaleString()}`,
    percentage: parseInt(c.percentage || 0),
  }));

  const recentActivity = [
    ...(dashboardData.recentOrders[0]?.customer
      ? [{ action: 'New order received', user: dashboardData.recentOrders[0].customer, time: getTimeAgo(dashboardData.recentOrders[0].date), Icon: ShoppingCart }]
      : []),
    ...(dashboardData.topProducts.length > 0
      ? [{ action: 'Top product trending', user: 'System', time: 'Today', Icon: Package }]
      : []),
    ...(dashboardData.ordersByStatus.delivered > 0
      ? [{ action: `${dashboardData.ordersByStatus.delivered} orders delivered`, user: 'Shipping', time: 'Today', Icon: Truck }]
      : []),
    ...(dashboardData.recentOrders[1]?.customer
      ? [{ action: 'Payment processed', user: dashboardData.recentOrders[1].customer, time: getTimeAgo(dashboardData.recentOrders[1].date), Icon: CreditCard }]
      : []),
    { action: 'New customer registered', user: 'System', time: 'Today', Icon: Users },
  ].slice(0, 5);

  const footerStats = [
    { label: "Today's orders",  value: dashboardData.todayOrders,                         Icon: ShoppingCart },
    { label: "Today's revenue", value: `$${dashboardData.todayRevenue.toLocaleString()}`,  Icon: CreditCard   },
    { label: 'In shipping',     value: dashboardData.ordersByStatus.shipped,               Icon: Truck        },
    { label: 'Delivered',       value: dashboardData.ordersByStatus.delivered,             Icon: CheckCircle  },
  ];

  /* ──────────────────────────────────────────
     JSX
  ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <div className="container mx-auto px-2  py-8 space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
              BDmart <span className="font-medium">Admin</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Welcome back — here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add product
            </button>
          </div>
        </div>

        {/* ALERTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {alerts.slice(0, 3).map((a, i) => (
            <AlertStrip key={i} type={a.type} message={a.message} Icon={a.Icon} />
          ))}
        </div>

        {/* KPI STRIP — divided grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
          <KpiCard
            label="Total Revenue"
            value={`$${dashboardData.totalRevenue.toLocaleString()}`}
            badge={`${Math.abs(dashboardData.revenueChange)}%`}
            badgeUp={dashboardData.revenueChange >= 0}
            sub="vs last month"
          />
          <KpiCard
            label="Total Orders"
            value={dashboardData.totalOrders?.toLocaleString() ?? '—'}
            badge="8.1%"
            badgeUp
            sub="vs last month"
          />
          <KpiCard
            label="Customers"
            value={dashboardData.totalCustomers?.toLocaleString() ?? '—'}
            badge="5.3%"
            badgeUp
            sub="new this month"
          />
          <KpiCard
            label="Avg. Order Value"
            value={`$${dashboardData.avgOrderValue?.toFixed(2) ?? '0.00'}`}
            badge="2.1%"
            badgeUp={false}
            sub="vs last month"
          />
        </div>

        {/* ORDERS + ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                title={<><ShoppingCart className="w-4 h-4 text-gray-400" />Recent orders</>}
                subtitle="Latest transactions from your store"
                action={
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Order', 'Customer', 'Product', 'Amount', 'Status', ''].map(h => (
                        <th key={h} className="text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium px-4 py-3 border-b border-gray-100 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-50 whitespace-nowrap">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-50 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Ava initials={order.avatar} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />{order.date}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-50 whitespace-nowrap">
                          {order.product}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-50 whitespace-nowrap">
                          {order.amount}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-50 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 border-b border-gray-50">
                          <GhostBtn><MoreVertical className="w-4 h-4" /></GhostBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader
              title={<><Activity className="w-4 h-4 text-gray-400" />Recent activity</>}
              subtitle="Live updates"
              action={<Bell className="w-4 h-4 text-gray-300" />}
            />
            <CardBody>
              <div className="space-y-0.5">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.Icon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{item.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">by {item.user}</p>
                      <p className="text-xs text-gray-300 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* TOP PRODUCTS + CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top Products */}
          <Card>
            <CardHeader
              title={<><TrendingUp className="w-4 h-4 text-gray-400" />Top products</>}
              subtitle="Best-selling items"
              action={<GhostBtn><Filter className="w-4 h-4" /></GhostBtn>}
            />
            <CardBody className="space-y-0.5">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="text-xs font-medium text-gray-300 w-5 flex-shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{p.sales} sales</span>
                      <span className="text-gray-200 text-xs">·</span>
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{p.revenue}</p>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                      {p.trend}
                    </span>
                    <p className="text-xs text-gray-300 mt-0.5">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Sales by Category */}
          <Card>
            <CardHeader
              title={<><BarChart3 className="w-4 h-4 text-gray-400" />Sales by category</>}
              subtitle="Revenue breakdown"
              action={<GhostBtn><MoreVertical className="w-4 h-4" /></GhostBtn>}
            />
            <CardBody className="space-y-4">
              {salesByCategory.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{c.category}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-medium text-gray-900">{c.amount}</span>
                      <span className="text-xs text-gray-400">({c.percentage}%)</span>
                    </div>
                  </div>
                  <ProgressBar value={c.percentage} />
                </div>
              ))}

              {/* Revenue summary */}
              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-400">Total revenue</span>
                <div className="text-right">
                  <p className="text-2xl font-light tracking-tight text-gray-900">
                    ${dashboardData.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      dashboardData.revenueChange >= 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {dashboardData.revenueChange > 0 ? '+' : ''}{dashboardData.revenueChange}%
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* FOOTER STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {footerStats.map((s, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <s.Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-base font-medium text-gray-900 mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* PRODUCT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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