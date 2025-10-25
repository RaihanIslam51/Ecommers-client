'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable Dropdown Component
 * @param {string} label - Dropdown label
 * @param {Array} options - Array of {value, label, icon}
 * @param {Function} onChange - Change callback
 * @param {string} value - Selected value
 */
const Dropdown = ({ 
  label,
  options = [],
  onChange,
  value,
  placeholder = 'Select an option',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors flex items-center gap-2
                ${value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
              `}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
