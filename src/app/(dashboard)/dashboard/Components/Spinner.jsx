import React from 'react';

/**
 * Reusable Spinner Component
 * @param {string} size - 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} color - 'blue', 'white', 'gray', 'green', 'red'
 */
const Spinner = ({ 
  size = 'md',
  color = 'blue',
  className = '' 
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
  };

  return (
    <div 
      className={`
        ${sizes[size]} 
        ${colors[color]} 
        border-2 border-t-transparent 
        rounded-full animate-spin
        ${className}
      `}
    ></div>
  );
};

export default Spinner;
