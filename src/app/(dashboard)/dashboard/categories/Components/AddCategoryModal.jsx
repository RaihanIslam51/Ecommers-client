'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

/**
 * Add/Edit Category Modal Component
 */
const AddCategoryModal = ({ isOpen, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState(editData || {
    name: '',
    description: '',
    image: '',
    color: '#10b981',
    status: 'active'
  });

  const [imagePreview, setImagePreview] = useState(editData?.image || '');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {editData ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Electronics, Fashion, Food"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the category..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Image
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
                  {imagePreview ? (
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 800x800px, Max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Color and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-16 h-12 rounded-lg cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium shadow-lg shadow-green-500/30 transition-all"
              >
                {editData ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
