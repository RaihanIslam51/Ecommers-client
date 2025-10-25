import React from 'react';

/**
 * Reusable Badge Component
 * @param {string} variant - 'success', 'warning', 'danger', 'info', 'neutral'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {React.ReactNode} children - Badge content
 * @param {React.ReactNode} icon - Icon component
 */
const Badge = ({ 
  variant = 'neutral', 
  size = 'md', 
  children, 
  icon,
  dot = false,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium';
  
  const variants = {
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border border-purple-200',
    pink: 'bg-pink-100 text-pink-700 border border-pink-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>}
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
