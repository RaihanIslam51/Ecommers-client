'use client';
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaUser, FaPhone, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from '@/lib/axios';

const SupportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    messageType: 'complaint',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in name, phone, and message fields',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send message to admin dashboard
      const response = await axios.post('/messages', {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || 'Not provided',
        messageType: formData.messageType,
        message: formData.message,
        source: 'support_modal' // To identify it came from navbar
      });

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'আপনার complaint/message পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।',
        confirmButtonColor: '#10b981'
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        messageType: 'complaint',
        message: ''
      });

      // Close modal
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white text-black p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light tracking-wide">Customer Support</h2>
              <p className="text-gray-500 text-sm mt-2 font-light">আমরা আপনাকে সাহায্য করতে প্রস্তুত</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <IoClose size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
              <FaUser className="inline mr-2 text-gray-600" />
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার নাম লিখুন"
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
              <FaPhone className="inline mr-2 text-gray-600" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
              required
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
              <FaEnvelope className="inline mr-2 text-gray-600" />
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
            />
          </div>

          {/* Message Type */}
          <div>
            <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
              <FaCommentDots className="inline mr-2 text-gray-600" />
              Message Type
            </label>
            <select
              name="messageType"
              value={formData.messageType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors text-black font-light"
            >
              <option value="complaint">Complaint (অভিযোগ)</option>
              <option value="inquiry">Inquiry (জিজ্ঞাসা)</option>
              <option value="feedback">Feedback (মতামত)</option>
              <option value="support">Support (সহায়তা)</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="আপনার complaint/message বিস্তারিত লিখুন..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none transition-colors resize-none text-black font-light"
              required
            />
            <p className="text-xs text-gray-500 mt-2 font-light">
              {formData.message.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-black hover:border-black transition-colors font-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MdSend size={20} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="px-8 pb-8">
          <div className="bg-white p-6 border border-gray-200">
            <p className="text-sm text-black font-light">
              <strong className="font-light">📞 Emergency Contact:</strong> +880 1956-486761
            </p>
            <p className="text-sm text-gray-600 mt-2 font-light">
              আমরা সাধারণত ২৪ ঘণ্টার মধ্যে response দিয়ে থাকি
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
