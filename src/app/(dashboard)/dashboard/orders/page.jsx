'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import {
    OrderStats,
    OrderFilters,
    OrderTable,
    OrderDetailsModal,
    QuickActions,
    RecentActivity
} from './Components';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'today', // Default to today's orders
        search: ''
    });

    // Fetch orders from API
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/orders');
            if (response.data && Array.isArray(response.data)) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to fetch orders',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper functions to filter orders by date
    const isToday = (date) => {
        const today = new Date();
        const orderDate = new Date(date);
        return orderDate.toDateString() === today.toDateString();
    };

    const isThisWeek = (date) => {
        const today = new Date();
        const orderDate = new Date(date);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo && orderDate <= today;
    };

    const isThisMonth = (date) => {
        const today = new Date();
        const orderDate = new Date(date);
        return orderDate.getMonth() === today.getMonth() && 
               orderDate.getFullYear() === today.getFullYear();
    };

    // Calculate stats from real data
    const stats = {
        total: orders.length.toString(),
        today: orders.filter(o => o.orderDate && isToday(o.orderDate)).length.toString(),
        weekly: orders.filter(o => o.orderDate && isThisWeek(o.orderDate)).length.toString(),
        monthly: orders.filter(o => o.orderDate && isThisMonth(o.orderDate)).length.toString(),
        pending: orders.filter(o => o.status === 'pending' || !o.status).length.toString(),
        processing: orders.filter(o => o.status === 'processing').length.toString(),
        shipped: orders.filter(o => o.status === 'shipped').length.toString(),
        delivered: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length.toString(),
        cancelled: orders.filter(o => o.status === 'cancelled').length.toString()
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm
        }));
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
            
            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    (order._id || order.id) === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            Swal.fire({
                title: 'Success!',
                text: 'Order status updated successfully',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update order status',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleDeleteOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/orders/${orderId}`);
                
                // Update local state
                setOrders(prevOrders =>
                    prevOrders.filter(order => (order._id || order.id) !== orderId)
                );

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Order has been deleted.',
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000
                });
            } catch (error) {
                console.error('Error deleting order:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete order',
                    icon: 'error',
                    confirmButtonColor: '#3b82f6'
                });
            }
        }
    };

    // Filter orders based on current filters
    const filteredOrders = orders.filter(order => {
        // Status filter
        if (filters.status !== 'all') {
            const orderStatus = order.status || 'pending';
            if (filters.status !== orderStatus) return false;
        }

        // Date range filter
        if (filters.dateRange !== 'all' && order.orderDate) {
            if (filters.dateRange === 'today' && !isToday(order.orderDate)) {
                return false;
            }
            if (filters.dateRange === 'week' && !isThisWeek(order.orderDate)) {
                return false;
            }
            if (filters.dateRange === 'month' && !isThisMonth(order.orderDate)) {
                return false;
            }
        }

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const customerName = order.customerInfo?.name?.toLowerCase() || '';
            const productName = order.product?.name?.toLowerCase() || '';
            const orderId = (order._id || order.id || '').toString().toLowerCase();
            
            if (!customerName.includes(searchTerm) && 
                !productName.includes(searchTerm) && 
                !orderId.includes(searchTerm)) {
                return false;
            }
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Order Management
                        </h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            Manage and track all your orders in one place
                            {filters.dateRange !== 'all' && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    <span>📅</span>
                                    {filters.dateRange === 'today' && 'Today\'s Orders'}
                                    {filters.dateRange === 'week' && 'This Week\'s Orders'}
                                    {filters.dateRange === 'month' && 'This Month\'s Orders'}
                                </span>
                            )}
                        </p>
                    </div>
                    <button 
                        onClick={fetchOrders}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
                    >
                        <span className="text-xl">🔄</span>
                        Refresh Orders
                    </button>
                </div>
            </div>

            {/* Order Statistics */}
            <OrderStats 
                stats={stats} 
                activeFilter={filters.dateRange}
                onFilterChange={handleFilterChange}
            />

            {/* Quick Actions */}
            <QuickActions onRefresh={fetchOrders} />

            {/* Orders Section - Full Width */}
            <div className="space-y-6">
                {/* Filters */}
                <OrderFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                {/* Empty State Message */}
                {!loading && filteredOrders.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {filters.dateRange === 'today' && "No orders have been placed today."}
                            {filters.dateRange === 'week' && "No orders have been placed this week."}
                            {filters.dateRange === 'month' && "No orders have been placed this month."}
                            {filters.dateRange === 'all' && filters.search && "No orders match your search criteria."}
                            {filters.dateRange === 'all' && !filters.search && "No orders have been placed yet."}
                        </p>
                        {filters.dateRange !== 'all' && (
                            <button
                                onClick={() => handleFilterChange('dateRange', 'all')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View All Orders
                            </button>
                        )}
                    </div>
                )}

                {/* Orders Table */}
                {filteredOrders.length > 0 && (
                    <OrderTable
                        orders={filteredOrders}
                        loading={loading}
                        onViewDetails={handleViewDetails}
                        onUpdateStatus={handleUpdateStatus}
                        onDeleteOrder={handleDeleteOrder}
                    />
                )}
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onUpdateStatus={handleUpdateStatus}
                onDeleteOrder={handleDeleteOrder}
            />
        </div>
    );
};

export default OrdersPage;