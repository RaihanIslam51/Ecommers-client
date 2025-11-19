import React from 'react';

/**
 * Reusable Icon Box Component
 * @param {React.ReactNode} icon - Icon component
 * @param {string} size - 'sm', 'md', 'lg', 'xl'
 * @param {string} color - Color gradient
 * @param {string} bgColor - Background color gradient
 * @param {string} shape - 'square', 'circle'
 */
const IconBox = ({ 
  icon,
  size = 'md',
  color = 'from-blue-500 to-cyan-500',
  bgColor = 'from-blue-50 to-cyan-50',
  shape = 'square',
  className = '' 
}) => {
  const sizes = {
    sm: 'p-2 w-8 h-8',
    md: 'p-2.5 w-10 h-10',
    lg: 'p-3 w-12 h-12',
    xl: 'p-4 w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const shapes = {
    square: 'rounded-xl',
    circle: 'rounded-full',
  };

  return (
    <div 
      className={`
        ${sizes[size]} 
        ${shapes[shape]} 
        bg-linear-to-br ${bgColor} 
        flex items-center justify-center
        ${className}
      `}
    >
      <div className={`${iconSizes[size]} bg-linear-to-r ${color} text-transparent`}>
        {icon}
      </div>
    </div>
  );
};

export default IconBox;
