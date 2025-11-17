'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      }
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status - This will be used by both Orders page and NotificationBell
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      
      // Update local state immediately for instant UI feedback
      setOrders(prevOrders =>
        prevOrders.map(order =>
          (order._id || order.id) === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Emit custom event for other components to listen
      window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
        detail: { orderId, newStatus, order: response.data.order }
      }));

      return { success: true, order: response.data.order };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }, []);

  // Delete order
  const deleteOrder = useCallback(async (orderId) => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      
      setOrders(prevOrders =>
        prevOrders.filter(order => (order._id || order.id) !== orderId)
      );

      window.dispatchEvent(new CustomEvent('orderDeleted', {
        detail: { orderId }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }, []);

  // Get single order by ID
  const getOrderById = useCallback((orderId) => {
    return orders.find(order => (order._id || order.id) === orderId);
  }, [orders]);

  const value = {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    setOrders
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
