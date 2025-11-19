import React from 'react';

/**
 * Reusable Avatar Component
 * @param {string} src - Image source
 * @param {string} alt - Image alt text
 * @param {string} initials - Fallback initials
 * @param {string} size - 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} shape - 'circle', 'square'
 * @param {string} status - 'online', 'offline', 'away', 'busy'
 */
const Avatar = ({ 
  src, 
  alt = '', 
  initials = '?',
  size = 'md',
  shape = 'circle',
  status,
  className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`
          ${sizes[size]} 
          ${shapes[shape]} 
          flex items-center justify-center 
          font-bold text-white 
          bg-linear-to-br from-blue-500 to-indigo-500
          overflow-hidden
        `}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0 
            ${statusSizes[size]} 
            ${statusColors[status]} 
            border-2 border-white 
            rounded-full
          `}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
