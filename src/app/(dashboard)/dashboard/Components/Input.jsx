import React from 'react';

/**
 * Reusable Input Component
 * @param {string} type - Input type
 * @param {string} label - Input label
 * @param {string} placeholder - Input placeholder
 * @param {string} error - Error message
 * @param {React.ReactNode} icon - Icon component
 * @param {string} size - 'sm', 'md', 'lg'
 */
const Input = ({ 
  type = 'text',
  label,
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const iconPaddingLeft = icon && iconPosition === 'left' ? 'pl-10' : '';
  const iconPaddingRight = icon && iconPosition === 'right' ? 'pr-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${sizes[size]} 
            ${widthClass}
            ${iconPaddingLeft}
            ${iconPaddingRight}
            border border-gray-300 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
