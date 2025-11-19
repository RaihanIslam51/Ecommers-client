'use client';
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUser, FaPhone, FaEnvelope, FaClock, FaCommentDots, FaMapMarkerAlt } from 'react-icons/fa';
import { MdDelete, MdMarkEmailRead } from 'react-icons/md';
import { BiCopy } from 'react-icons/bi';
import Swal from 'sweetalert2';

const MessageDetailsModal = ({ message, isOpen, onClose, onDelete, onMarkAsRead }) => {
  if (!isOpen || !message) return null;

  // Copy to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Copied!',
      text: `${label} copied to clipboard`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get message type badge color
  const getMessageTypeBadge = (type) => {
    const badges = {
      customer_message: { bg: 'bg-green-100', text: 'text-green-700', label: 'Customer Message' },
      inquiry: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Inquiry' },
      complaint: { bg: 'bg-red-100', text: 'text-red-700', label: 'Complaint' },
      support: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Support Request' },
      feedback: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Feedback' }
    };
    return badges[type] || badges.customer_message;
  };

  const typeBadge = getMessageTypeBadge(message.type);

  // Handle delete with confirmation
  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Message?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(message.id);
        onClose();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Message has been deleted.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {message.customerName ? message.customerName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{message.customerName || 'Anonymous Customer'}</h2>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${typeBadge.bg} ${typeBadge.text}`}>
                    {typeBadge.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-green-600" />
              Contact Information
            </h3>
            <div className="space-y-3">
              {/* Phone */}
              {message.phone && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-800">{message.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.phone, 'Phone number')}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all"
                  >
                    <BiCopy className="text-gray-600" size={18} />
                  </button>
                </div>
              )}

              {/* Email */}
              {message.email && message.email !== 'Not provided' && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-blue-600" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-sm font-semibold text-gray-800">{message.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.email, 'Email')}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all"
                  >
                    <BiCopy className="text-gray-600" size={18} />
                  </button>
                </div>
              )}

              {/* Message Source */}
              {message.source && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-purple-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-500">Message Source</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {message.source.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-600" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Received At</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(message.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white rounded-xl p-5 border-2 border-green-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaCommentDots className="text-green-600" />
              Message
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {message.message.length} characters
              </p>
              <button
                onClick={() => copyToClipboard(message.message, 'Message')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <BiCopy size={14} />
                Copy Message
              </button>
            </div>
          </div>

          {/* Message Status */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {message.read ? (
                  <>
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-green-700">Read</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-orange-700">Unread</span>
                  </>
                )}
              </div>
              {!message.read && (
                <button
                  onClick={() => {
                    onMarkAsRead(message.id);
                    Swal.fire({
                      icon: 'success',
                      title: 'Marked as Read!',
                      timer: 1500,
                      showConfirmButton: false
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <MdMarkEmailRead size={18} />
                  Mark as Read
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Call Button */}
              {message.phone && (
                <a
                  href={`tel:${message.phone}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <FaPhone size={16} />
                  Call Customer
                </a>
              )}

              {/* Email Button */}
              {message.email && message.email !== 'Not provided' && (
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <FaEnvelope size={16} />
                  Send Email
                </a>
              )}

              {/* WhatsApp Button */}
              {message.phone && (
                <a
                  href={`https://wa.me/${message.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
              >
                <MdDelete size={18} />
                Delete Message
              </button>
            </div>
          </div>

          {/* Additional Info */}
          {message.id && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Message ID</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-gray-700">{message.id}</p>
                <button
                  onClick={() => copyToClipboard(message.id, 'Message ID')}
                  className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                >
                  <BiCopy className="text-gray-600" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-linear-to-r from-gray-100 to-gray-200 p-4 rounded-b-2xl border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsModal;
