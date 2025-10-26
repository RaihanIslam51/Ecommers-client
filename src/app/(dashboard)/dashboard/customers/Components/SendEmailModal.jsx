import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '@/lib/axios';

const SendEmailModal = ({ onClose, recipients, recipientNames }) => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        includeTemplate: true
    });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.subject.trim() || !formData.message.trim()) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Please fill in both subject and message fields',
                icon: 'warning',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Send Email?',
            html: `
                <div style="text-align: left;">
                    <p><strong>Recipients:</strong> ${recipients.length} customer${recipients.length > 1 ? 's' : ''}</p>
                    <p><strong>Subject:</strong> ${formData.subject}</p>
                    <p style="margin-top: 10px;">Are you sure you want to send this email?</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Send Email',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        try {
            setSending(true);

            const emailData = {
                recipients,
                subject: formData.subject,
                message: formData.message,
                htmlContent: formData.includeTemplate ? undefined : null // Let server use template if true
            };

            const response = await axiosInstance.post('/api/send-email', emailData);

            if (response.data.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                onClose();
            }
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Extract error message from response
            let errorTitle = 'Error!';
            let errorMessage = 'Failed to send email. Please try again.';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                if (errorData.message) {
                    errorMessage = errorData.message;
                }
                
                // Add more details if available
                if (errorData.details) {
                    errorMessage += '\n\n' + errorData.details;
                }
                
                // Add hint if available
                if (errorData.hint) {
                    errorMessage += '\n\n💡 ' + errorData.hint;
                }
                
                // Specific error titles
                if (error.response.status === 503) {
                    errorTitle = 'Email Not Configured';
                } else if (error.response.status === 400) {
                    errorTitle = 'Validation Error';
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                title: errorTitle,
                html: errorMessage.replace(/\n/g, '<br>'),
                icon: 'error',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'OK',
                width: '600px'
            });
        } finally {
            setSending(false);
        }
    };

    // Email templates
    const templates = [
        {
            name: 'Welcome Message',
            subject: 'Welcome to BDMart!',
            message: 'Dear Customer,\n\nThank you for being a valued customer of BDMart. We appreciate your business and look forward to serving you.\n\nBest regards,\nThe BDMart Team'
        },
        {
            name: 'Special Offer',
            subject: 'Exclusive Offer Just for You!',
            message: 'Dear Customer,\n\nWe have a special offer exclusively for our valued customers! Check out our latest deals and promotions.\n\nDon\'t miss out on these amazing savings!\n\nBest regards,\nThe BDMart Team'
        },
        {
            name: 'Order Update',
            subject: 'Update on Your Recent Order',
            message: 'Dear Customer,\n\nWe wanted to provide you with an update regarding your recent order with BDMart.\n\nIf you have any questions, please don\'t hesitate to contact us.\n\nBest regards,\nThe BDMart Team'
        },
        {
            name: 'Newsletter',
            subject: 'BDMart Monthly Newsletter',
            message: 'Dear Customer,\n\nWelcome to our monthly newsletter! Here\'s what\'s new at BDMart this month.\n\nStay tuned for more updates and exciting offers!\n\nBest regards,\nThe BDMart Team'
        }
    ];

    const applyTemplate = (template) => {
        setFormData(prev => ({
            ...prev,
            subject: template.subject,
            message: template.message
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            📧 Send Email to Customers
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Sending to {recipients.length} customer{recipients.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={sending}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Recipients Preview */}
                    <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span>👥</span> Recipients ({recipients.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                            {recipients.slice(0, 10).map((email, index) => (
                                <span
                                    key={email}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-blue-200"
                                >
                                    <span className="text-xs">📧</span>
                                    {recipientNames && recipientNames[index] ? recipientNames[index] : email}
                                </span>
                            ))}
                            {recipients.length > 10 && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-700 font-semibold">
                                    +{recipients.length - 10} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Email Templates */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span>📝</span> Quick Templates
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {templates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => applyTemplate(template)}
                                    disabled={sending}
                                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50"
                                >
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                disabled={sending}
                                placeholder="Enter email subject"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                disabled={sending}
                                placeholder="Enter your message here..."
                                rows={10}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.message.length} characters
                            </p>
                        </div>

                        {/* Template Option */}
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <input
                                type="checkbox"
                                name="includeTemplate"
                                id="includeTemplate"
                                checked={formData.includeTemplate}
                                onChange={handleChange}
                                disabled={sending}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="includeTemplate" className="text-sm text-gray-700 cursor-pointer">
                                <span className="font-semibold">Use professional email template</span>
                                <span className="text-gray-500 ml-1">(Includes BDMart branding and styling)</span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={sending}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={sending || !formData.subject.trim() || !formData.message.trim()}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <span className="animate-spin">⚙️</span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <span>📤</span>
                                        Send Email
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SendEmailModal;
