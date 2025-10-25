import React from 'react';

/**
 * Reusable Table Component
 * @param {Array} columns - Array of column definitions [{key, label, render}]
 * @param {Array} data - Array of data objects
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} striped - Add striped rows
 */
const Table = ({ 
  columns = [], 
  data = [], 
  hoverable = true,
  striped = false,
  className = '' 
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column, index) => (
              <th 
                key={index}
                className="text-left py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              className={`
                border-b border-gray-100 
                ${hoverable ? 'hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer' : ''}
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex}
                  className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-700"
                >
                  {column.render ? column.render(row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default Table;
