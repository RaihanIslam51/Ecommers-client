import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="bg-white border border-gray-200 p-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Info */}
                <div className="text-sm text-gray-600 font-light">
                    Showing <span className="font-light text-black">{startItem}</span> to{' '}
                    <span className="font-light text-black">{endItem}</span> of{' '}
                    <span className="font-light text-black">{totalItems}</span> customers
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-6 py-2 border border-gray-200 bg-white text-black hover:border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-light text-sm"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-600 font-light">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-4 py-2 font-light transition-all duration-300 text-sm ${
                                        currentPage === page
                                            ? 'bg-black text-white border border-black'
                                            : 'border border-gray-200 text-black hover:border-black'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-6 py-2 border border-gray-200 bg-white text-black hover:border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-light text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
