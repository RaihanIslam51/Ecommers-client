import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Alert Component
 * @param {string} type - 'success', 'warning', 'danger', 'info'
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {React.ReactNode} icon - Icon component
 * @param {boolean} dismissible - Show close button
 * @param {Function} onDismiss - Dismiss callback
 */
const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  icon,
  dismissible = false,
  onDismiss,
  className = '' 
}) => {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
  };

  const style = types[type];

  return (
    <div 
      className={`
        p-4 rounded-xl border flex items-start gap-3
        ${style.bg} ${style.border} ${className}
      `}
    >
      {icon && (
        <span className={`${style.iconColor} mt-0.5 flex-shrink-0`}>
          {icon}
        </span>
      )}
      <div className="flex-1">
        {title && (
          <h4 className={`text-sm font-semibold ${style.titleColor} mb-1`}>
            {title}
          </h4>
        )}
        {message && (
          <p className={`text-sm ${style.messageColor}`}>
            {message}
          </p>
        )}
      </div>
      {dismissible && (
        <button 
          onClick={onDismiss}
          className={`${style.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
