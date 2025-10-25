import React from 'react';

/**
 * Reusable Empty State Component
 * @param {React.ReactNode} icon - Icon component
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description
 * @param {React.ReactNode} action - Action button/component
 */
const EmptyState = ({ 
  icon,
  title = 'No data found',
  description,
  action,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
