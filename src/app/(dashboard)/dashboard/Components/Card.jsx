import React from 'react';

/**
 * Reusable Card Component
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Card title
 * @param {string} subtitle - Card subtitle
 * @param {React.ReactNode} headerAction - Action component in header
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} bordered - Add border
 */
const Card = ({ 
  children, 
  title, 
  subtitle,
  headerAction,
  hoverable = false,
  bordered = true,
  className = '',
  bodyClassName = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl overflow-hidden';
  const borderClass = bordered ? 'border border-gray-200' : '';
  const hoverClass = hoverable ? 'hover:shadow-xl transition-shadow duration-300 cursor-pointer' : 'shadow-sm';

  return (
    <div 
      className={`${baseClasses} ${borderClass} ${hoverClass} ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-4 sm:px-5 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-5 md:p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
