import React from 'react';

/**
 * Reusable Progress Bar Component
 * @param {number} value - Progress value (0-100)
 * @param {string} color - 'blue', 'green', 'purple', 'orange', 'red'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} showLabel - Show percentage label
 * @param {string} label - Custom label text
 */
const ProgressBar = ({ 
  value = 0, 
  color = 'blue',
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  className = '' 
}) => {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    red: 'from-red-500 to-rose-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>{label || 'Progress'}</span>
          {showLabel && <span className="font-semibold">{clampedValue}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${sizes[size]} overflow-hidden`}>
        <div 
          className={`
            ${sizes[size]} 
            bg-linear-to-r ${colors[color]} 
            rounded-full transition-all duration-1000
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${clampedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
