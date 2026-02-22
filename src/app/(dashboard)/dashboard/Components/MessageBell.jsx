'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import MessageDetailsModal from './MessageDetailsModal';
import { IoClose } from 'react-icons/io5';

const MessageBell = () => {
    const [messages, setMessages] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const dropdownRef = useRef(null);
    const notifiedMessagesRef = useRef(new Set()); // Track which messages have been notified

    const fetchMessages = async () => {
        try {
            console.log('Fetching messages...');
            const response = await axios.get('/messages');
            console.log('Messages response:', response.data);
            
            if (response.data && response.data.messages) {
                setMessages(response.data.messages);
                const unread = response.data.messages.filter(m => !m.read).length;
                setUnreadCount(unread);
                console.log(`Found ${response.data.messages.length} messages, ${unread} unread`);
                
                // Show browser notification for new messages (only once per message)
                if (unread > 0 && 'Notification' in window && Notification.permission === 'granted') {
                    const latestMessage = response.data.messages[0];
                    if (!latestMessage.read && latestMessage.type === 'customer_message') {
                        // Check if we haven't notified about this message yet
                        const messageId = latestMessage._id || latestMessage.id;
                        if (!notifiedMessagesRef.current.has(messageId)) {
                            new Notification('New Customer Message!', {
                                body: `${latestMessage.customerName}: ${latestMessage.message.substring(0, 50)}...`,
                                icon: '/favicon.ico'
                            });
                            // Mark this message as notified
                            notifiedMessagesRef.current.add(messageId);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            
            // Enhanced error logging
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                console.error('❌ Cannot connect to server. Make sure the server is running on http://localhost:5000');
                console.error('💡 Run: cd server && npm run dev');
            } else {
                console.error('Error details:', error.response?.data || error.message);
            }
            
            // Set empty messages on error to avoid undefined errors
            setMessages([]);
            setUnreadCount(0);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchMessages();

        // Poll for new messages every 5 seconds (for testing - change to 30000 for production)
        const interval = setInterval(() => {
            fetchMessages();
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

    const markAsRead = async (messageId) => {
        try {
            await axios.post(`/messages/${messageId}/read`);
            setMessages(prev => 
                prev.map(m => m.id === messageId ? { ...m, read: true } : m)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/messages/read-all');
            setMessages(prev => prev.map(m => ({ ...m, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all messages as read:', error);
        }
    };

    const deleteMessage = async (messageId) => {
        try {
            await axios.delete(`/messages/${messageId}`);
            setMessages(prev => prev.filter(m => m.id !== messageId));
            // Update unread count if deleted message was unread
            const deletedMessage = messages.find(m => m.id === messageId);
            if (deletedMessage && !deletedMessage.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const handleMessageClick = (message) => {
        setSelectedMessage(message);
        setShowDetailsModal(true);
        if (!message.read) {
            markAsRead(message.id);
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

    const getMessageTypeColor = (type) => {
        switch(type) {
            case 'customer_message':
                return 'bg-green-100 text-black';
            case 'inquiry':
                return 'bg-blue-100 text-blue-600';
            case 'complaint':
                return 'bg-red-100 text-red-600';
            case 'support':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setShowDropdown(!showDropdown);
                    requestNotificationPermission();
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                {/* WhatsApp style icon */}
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-green-50">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Messages
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">Customer inquiries</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-black hover:text-green-800 font-semibold"
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
                        {messages.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-sm">No messages yet</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => handleMessageClick(message)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                        !message.read ? 'bg-green-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${
                                            message.type === 'customer_message' ? 'bg-green-500' :
                                            message.type === 'inquiry' ? 'bg-blue-500' :
                                            message.type === 'complaint' ? 'bg-red-500' :
                                            'bg-purple-500'
                                        }`}>
                                            {message.customerName ? message.customerName.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {message.customerName}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {getTimeAgo(message.createdAt)}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {message.message}
                                            </p>
                                            {message.phone && (
                                                <p className="text-xs text-black mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    {message.phone}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getMessageTypeColor(message.type)}`}>
                                                    {message.type.replace('_', ' ')}
                                                </span>
                                                {!message.read && (
                                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {messages.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
                            <button className="text-sm text-black hover:text-green-800 font-semibold">
                                View All Messages
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Message Details Modal */}
            <MessageDetailsModal
                message={selectedMessage}
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                onDelete={deleteMessage}
                onMarkAsRead={markAsRead}
            />
        </div>
    );
};

export default MessageBell;
