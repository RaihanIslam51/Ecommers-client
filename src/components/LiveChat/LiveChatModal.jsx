'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const LiveChatModal = ({ isOpen, onClose }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication and create/load session
  useEffect(() => {
    if (isOpen && status === 'authenticated' && session?.user) {
      const savedSession = localStorage.getItem(`chatSession_${session.user.email}`);
      
      if (savedSession) {
        setSessionId(savedSession);
        loadMessages(savedSession);
      } else {
        createNewSession();
      }
    }
  }, [isOpen, status, session]);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (sessionId && status === 'authenticated') {
      const interval = setInterval(() => {
        loadMessages(sessionId);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [sessionId, status]);

  const loadMessages = async (sid) => {
    try {
      const response = await axiosInstance.get(`/chat-sessions/${sid}/messages`);
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewSession = async () => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post('/chat-sessions', {
        customerName: session.user.name || 'User',
        customerEmail: session.user.email
      });

      if (response.data.success) {
        const newSessionId = response.data.session._id || response.data.session.id;
        setSessionId(newSessionId);
        
        // Save to localStorage with user email as key
        localStorage.setItem(`chatSession_${session.user.email}`, newSessionId);
        
        loadMessages(newSessionId);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to start chat session. Please try again.',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/chat-sessions/${sessionId}/messages`, {
        sender: 'customer',
        message: newMessage.trim()
      });

      if (response.data.success) {
        setNewMessage('');
        loadMessages(sessionId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send message. Please try again.',
        confirmButtonColor: '#000',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndChat = () => {
    Swal.fire({
      title: 'End Chat Session?',
      text: 'Are you sure you want to end this chat?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, end chat',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (session?.user?.email) {
          localStorage.removeItem(`chatSession_${session.user.email}`);
        }
        setSessionId(null);
        setMessages([]);
        onClose();
      }
    });
  };

  const handleLoginRedirect = () => {
    onClose();
    router.push('/auth/signin');
  };

  if (!isOpen) return null;

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slide-up">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h3>
              <p className="text-gray-600">Please login to start a chat with our support team</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-blue-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2">
              You need to be logged in to use our live chat support.
            </p>
            <p className="text-sm text-gray-500">
              Login now to get instant help from our support team!
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Login Now
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading if checking authentication
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Live Chat Support</h3>
              <p className="text-xs text-blue-100">
                {sessionId ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
          {/* Welcome Message - Always show */}
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">👋</span>
                </div>
                <span className="font-semibold">RannarKaj.com Support</span>
              </div>
              <p className="text-sm mb-1">
                Hello {session?.user?.name || 'there'}! Welcome to RannarKaj.com Live Chat Support! 🎉
              </p>
              <p className="text-xs text-blue-100">
                We're here to help you with any questions about our products, orders, or services. How can we assist you today?
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'customer'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">Chatting as {session?.user?.name || 'User'}</span>
            <button
              onClick={handleEndChat}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              End Chat
            </button>
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || !sessionId}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim() || !sessionId}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors disabled:bg-gray-400"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;
