import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Delete Confirmation Modal Component
 */
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, categoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white border border-gray-200 w-full max-w-md">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-black opacity-60" />
            </div>

            <h2 className="text-2xl font-light text-black mb-2 tracking-wide">
              Delete Category?
            </h2>
            
            <p className="text-gray-600 font-light mb-6">
              Are you sure you want to delete <span className="font-light text-black">&ldquo;{categoryName}&rdquo;</span>? 
              This action cannot be undone and all associated data will be permanently removed.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
