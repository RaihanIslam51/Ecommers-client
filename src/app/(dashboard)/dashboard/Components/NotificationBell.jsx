'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import OrderDetailsModal from './OrderDetailsModal';
import { IoClose } from 'react-icons/io5';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const dropdownRef = useRef(null);
    const notifiedOrdersRef = useRef(new Set()); // Track which orders have been notified

    const fetchNotifications = async () => {
        try {
            console.log('Fetching notifications...');
            const response = await axios.get('/notifications');
            console.log('Notifications response:', response.data);
            
            if (response.data && response.data.notifications) {
                setNotifications(response.data.notifications);
                const unread = response.data.notifications.filter(n => !n.read).length;
                setUnreadCount(unread);
                console.log(`Found ${response.data.notifications.length} notifications, ${unread} unread`);
                
                // Show browser notification for new orders (only once per order)
                if (unread > 0 && 'Notification' in window && Notification.permission === 'granted') {
                    const latestOrder = response.data.notifications[0];
                    if (!latestOrder.read && latestOrder.type === 'new_order') {
                        // Check if we haven't notified about this order yet
                        const orderId = latestOrder.orderId || latestOrder._id;
                        if (!notifiedOrdersRef.current.has(orderId)) {
                            new Notification('New Order Received!', {
                                body: `Order #${orderId} - $${latestOrder.amount.toFixed(2)}`,
                                icon: '/favicon.ico'
                            });
                            // Mark this order as notified
                            notifiedOrdersRef.current.add(orderId);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            
            // Enhanced error logging
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                console.error('❌ Cannot connect to server. Make sure the server is running on http://localhost:5000');
                console.error('💡 Run: cd server && npm run dev');
            } else {
                console.error('Error details:', error.response?.data || error.message);
            }
            
            // Set empty notifications on error to avoid undefined errors
            setNotifications([]);
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Poll for new notifications every 5 seconds (for testing - change to 30000 for production)
        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
        return Math.floor(seconds / 86400) + ' days ago';
    };

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setShowDetailsModal(true);
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        // Refresh notifications after status update
        fetchNotifications();
    };

    // Listen for order status updates from context
    useEffect(() => {
        const handleOrderUpdate = (event) => {
            console.log('Order status updated, refreshing notifications:', event.detail);
            fetchNotifications();
        };

        window.addEventListener('orderStatusUpdated', handleOrderUpdate);
        return () => window.removeEventListener('orderStatusUpdated', handleOrderUpdate);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setShowDropdown(!showDropdown);
                    requestNotificationPermission();
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Mark all as read
                                </button>
                            )}
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Close"
                            >
                                <IoClose size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                            notification.type === 'new_order' ? 'bg-green-100 text-black' :
                                            notification.type === 'order_updated' ? 'bg-blue-100 text-blue-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {notification.type === 'new_order' ? '🛒' : 
                                             notification.type === 'order_updated' ? '🔄' : '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Order Details Modal */}
            <OrderDetailsModal
                notification={selectedNotification}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
};

export default NotificationBell;
