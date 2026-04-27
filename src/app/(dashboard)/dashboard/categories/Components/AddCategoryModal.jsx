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
        <div className="relative bg-white border border-gray-200 w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <h2 className="text-2xl font-light text-black tracking-wide">
              {editData ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Electronics, Fashion, Food"
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Brief description of the category..."
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                Category Image
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-32 h-32 border border-gray-200 overflow-hidden bg-white flex items-center justify-center relative">
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
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light">
                    <Upload className="w-5 h-5" />
                    <span className="font-light">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 font-light mt-3">
                    Recommended: 800x800px, Max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Color and Status Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Color Picker */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                  Theme Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-16 h-12 cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors bg-white text-black font-light"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light"
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
