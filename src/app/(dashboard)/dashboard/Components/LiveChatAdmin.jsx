'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaCircle } from 'react-icons/fa';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const LiveChatAdmin = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat sessions
  useEffect(() => {
    if (showPanel) {
      loadChatSessions();
      const interval = setInterval(loadChatSessions, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [showPanel]);

  // Load messages for selected session
  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession._id || selectedSession.id);
      const interval = setInterval(() => {
        loadMessages(selectedSession._id || selectedSession.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  const loadChatSessions = async () => {
    try {
      const response = await axiosInstance.get('/chat-sessions');
      if (response.data.success) {
        const sessions = response.data.sessions || [];
        setChatSessions(sessions);
        
        // Count unread sessions
        const unread = sessions.filter(s => s.status === 'active').length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadMessages = async (sessionId) => {
    try {
      const response = await axiosInstance.get(`/chat-sessions/${sessionId}/messages`);
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedSession) return;

    setLoading(true);
    try {
      const sessionId = selectedSession._id || selectedSession.id;
      const response = await axiosInstance.post(`/chat-sessions/${sessionId}/messages`, {
        sender: 'admin',
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
        text: 'Failed to send message',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async (sessionId) => {
    const result = await Swal.fire({
      title: 'Close Chat Session?',
      text: 'This will mark the chat as resolved',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, close it'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.patch(`/chat-sessions/${sessionId}`, {
          status: 'closed'
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Chat Closed',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
        
        setSelectedSession(null);
        loadChatSessions();
      } catch (error) {
        console.error('Error closing session:', error);
      }
    }
  };

  return (
    <>
      {/* Live Chat Icon Button */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 group active:scale-95 relative"
          aria-label="Live Chat"
          title="Live Chat Support"
        >
          <FaComments className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 items-center justify-center text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {showPanel && (
        <div className="fixed right-4 top-20 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaComments className="text-xl" />
              <div>
                <h3 className="font-semibold">Live Chat Support</h3>
                <p className="text-xs text-blue-100">
                  {chatSessions.length} active session(s)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sessions List */}
            <div className={`${selectedSession ? 'hidden md:block' : 'block'} w-full md:w-2/5 border-r border-gray-200 overflow-y-auto`}>
              {chatSessions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <FaComments className="mx-auto text-4xl mb-2 text-gray-300" />
                  <p className="text-sm">No active chats</p>
                </div>
              ) : (
                chatSessions.map((session) => (
                  <button
                    key={session._id || session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedSession?._id === session._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">
                          {session.customerName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.customerEmail}
                        </p>
                      </div>
                      {session.status === 'active' && (
                        <FaCircle className="text-green-500 text-xs flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>

            {/* Chat Area */}
            <div className={`${selectedSession ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
              {!selectedSession ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FaComments className="mx-auto text-5xl mb-3" />
                    <p className="text-sm">Select a chat to view messages</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{selectedSession.customerName}</p>
                      <p className="text-xs text-gray-500">{selectedSession.customerEmail}</p>
                    </div>
                    <button
                      onClick={() => handleCloseSession(selectedSession._id || selectedSession.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
                    >
                      Close Chat
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-10">
                        <p className="text-sm">No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              msg.sender === 'admin'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !newMessage.trim()}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors disabled:bg-gray-400"
                      >
                        <FaPaperPlane className="text-sm" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatAdmin;
