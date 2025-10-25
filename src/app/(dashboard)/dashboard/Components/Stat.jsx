import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Reusable Stat Component for displaying statistics
 * @param {string} title - Stat title
 * @param {string} value - Stat value
 * @param {string} change - Percentage change
 * @param {string} trend - 'up' or 'down'
 * @param {React.ReactNode} icon - Icon component
 * @param {string} color - Color gradient
 * @param {string} description - Additional description
 */
const Stat = ({ 
  title, 
  value, 
  change, 
  trend = 'up',
  icon,
  color = 'from-blue-500 to-cyan-500',
  bgColor = 'from-blue-50 to-cyan-50',
  description,
  className = '' 
}) => {
  const Icon = icon;

  return (
    <div 
      className={`
        bg-white rounded-xl p-4 sm:p-5 md:p-6 
        border border-gray-200 
        hover:shadow-xl transition-all duration-300 
        group cursor-pointer active:scale-[0.98] 
        touch-manipulation relative overflow-hidden
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          {Icon && (
            <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${bgColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'inherit' }} />
            </div>
          )}
          {change && (
            <div className={`
              flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full 
              text-[10px] sm:text-xs font-semibold
              ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        
        <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{value}</p>
        
        {description && (
          <p className="text-xs text-gray-400 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Stat;
