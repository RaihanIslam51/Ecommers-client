'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';
import { FaPaperPlane, FaCheckCircle, FaUsers, FaEnvelope } from 'react-icons/fa';

const EmailPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: 'all' // 'all' or 'custom'
  });
  const [customEmails, setCustomEmails] = useState('');
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async () => {
    // Validation
    if (!formData.subject.trim() || !formData.message.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in both subject and message fields.',
        confirmButtonColor: '#000'
      });
      return;
    }

    // Confirm before sending
    const result = await Swal.fire({
      title: 'Send Email?',
      html: formData.recipients === 'all' 
        ? '<p>This will send email to <strong>all customers</strong> in the database.</p>'
        : `<p>This will send email to the specified recipients.</p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Send Email',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setSending(true);

    try {
      let response;

      if (formData.recipients === 'all') {
        // Send to all customers
        response = await axiosInstance.post('/email/send-to-all-customers', {
          subject: formData.subject,
          message: formData.message
        });
      } else {
        // Send to custom recipients
        const emails = customEmails.split(',').map(e => e.trim()).filter(e => e);
        
        if (emails.length === 0) {
          throw new Error('Please enter at least one valid email address');
        }

        response = await axiosInstance.post('/email/send-email', {
          recipients: emails,
          subject: formData.subject,
          message: formData.message
        });
      }

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Email Sent Successfully!',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Recipients:</strong> ${response.data.data?.sentTo || 0} customer(s)</p>
            <p style="color: #059669; margin-top: 15px;">✅ All emails have been sent successfully!</p>
          </div>
        `,
        confirmButtonColor: '#000'
      });

      // Reset form
      setFormData({
        subject: '',
        message: '',
        recipients: 'all'
      });
      setCustomEmails('');

    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send Email',
        text: error.response?.data?.message || error.message || 'An error occurred while sending the email.',
        confirmButtonColor: '#000'
      });
    } finally {
      setSending(false);
    }
  };

  const handleTestEmail = async () => {
    setSending(true);
    try {
      const response = await axiosInstance.get('/email/test');
      
      Swal.fire({
        icon: 'success',
        title: 'Email Configuration Test',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p>✅ <strong>Email service is working properly!</strong></p>
            <p style="margin-top: 10px;"><strong>Service:</strong> ${response.data.data?.service || 'Gmail'}</p>
            <p><strong>Email:</strong> ${response.data.data?.emailUser || 'Configured'}</p>
            <p style="color: #059669; margin-top: 15px;">A test email has been sent to your configured email address.</p>
          </div>
        `,
        confirmButtonColor: '#000'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Email Test Failed',
        text: error.response?.data?.message || 'Email service is not configured properly.',
        confirmButtonColor: '#000'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaEnvelope className="text-black" />
              Send Email to Customers
            </h1>
            <p className="text-gray-600 mt-2">
              Send promotional emails, updates, and announcements to your customers
            </p>
          </div>
          <button
            onClick={handleTestEmail}
            disabled={sending}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Test Email Config
          </button>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {/* Recipients Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Send To
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, recipients: 'all' }))}
              className={`p-4 border-2 rounded-xl transition-all ${
                formData.recipients === 'all'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <FaUsers className="text-2xl" />
                <div className="text-left">
                  <div className="font-semibold">All Customers</div>
                  <div className="text-sm text-gray-600">Send to everyone</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, recipients: 'custom' }))}
              className={`p-4 border-2 rounded-xl transition-all ${
                formData.recipients === 'custom'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-2xl" />
                <div className="text-left">
                  <div className="font-semibold">Custom Recipients</div>
                  <div className="text-sm text-gray-600">Specific emails</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Email Input */}
        {formData.recipients === 'custom' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Addresses (comma-separated)
            </label>
            <textarea
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              placeholder="customer1@example.com, customer2@example.com, ..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Separate multiple email addresses with commas
            </p>
          </div>
        )}

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., Special Offer - 50% Off This Week!"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Write your message here... This will be sent in a professional email template."
            rows="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            Your message will be automatically formatted in a professional email template
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSendEmail}
            disabled={sending}
            className="flex-1 px-6 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Email
              </>
            )}
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-black hover:bg-gray-50 transition-all font-semibold"
          >
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {preview && formData.subject && formData.message && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-green-600" />
            Email Preview
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-linear-to-r from-purple-600 to-purple-800 p-8 text-center">
              <h1 className="text-white text-3xl font-bold">🛒 RannarKaj.com</h1>
              <p className="text-white text-sm mt-2 opacity-90">Your Trusted Shopping Partner</p>
            </div>
            <div className="p-8 bg-white">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{formData.subject}</h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {formData.message}
              </div>
              <div className="mt-8 text-center">
                <a
                  href="#"
                  className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold"
                >
                  Visit RannarKaj.com
                </a>
              </div>
            </div>
            <div className="bg-gray-50 p-6 text-center border-t">
              <p className="text-gray-600 text-sm">© 2025 RannarKaj.com. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailPage;
