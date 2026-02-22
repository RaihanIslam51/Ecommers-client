'use client';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-6 sm:py-8 px-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 sm:p-3 border transition-colors ${
          currentPage === 1
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-black hover:bg-black hover:text-white hover:border-black'
        }`}
        aria-label="Previous page"
      >
        <FiChevronLeft className="text-lg sm:text-xl" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-2 text-gray-500 text-sm sm:text-base">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 font-medium transition-colors text-sm ${
                currentPage === page
                  ? 'bg-black text-white border border-black'
                  : 'bg-white border border-gray-300 text-black hover:border-black hover:bg-black hover:text-white'
              }`}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 sm:p-3 border transition-colors ${
          currentPage === totalPages
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-300 text-black hover:bg-black hover:text-white hover:border-black'
        }`}
        aria-label="Next page"
      >
        <FiChevronRight className="text-lg sm:text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
