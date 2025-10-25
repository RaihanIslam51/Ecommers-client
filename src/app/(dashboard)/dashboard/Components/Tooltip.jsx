'use client';

import React, { useState } from 'react';

/**
 * Reusable Tooltip Component
 * @param {React.ReactNode} children - Element to attach tooltip to
 * @param {string} content - Tooltip content
 * @param {string} position - 'top', 'bottom', 'left', 'right'
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  className = '' 
}) => {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div className={`absolute ${positions[position]} z-50 whitespace-nowrap`}>
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            {content}
          </div>
          <div className={`absolute ${arrows[position]} border-4 border-gray-900`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
