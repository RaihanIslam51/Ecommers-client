'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feature: '', // New field for feature text
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    sku: '',
    image: '',
    images: [],
    tags: '',
    weight: '',
    dimensions: '',
    warranty: '',
    returnPolicy: '30 days',
    showInCollection: true, // Default to true
    showInTopSelling: false,
    showInNewArrival: false,
    showInHotDeals: false,
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      // Server returns: { success: true, message: "...", categories: [...] }
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Category name required',
        text: 'Please enter a category name',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/categories', {
        name: newCategoryName.trim(),
        icon: '📦'
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'New category has been created',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Refresh categories and select the new one
        await fetchCategories();
        setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
        setNewCategoryName('');
        setShowAddCategory(false);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to add category',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  useEffect(() => {
    if (product) {
      console.log('ProductForm: Initializing with product:', product);
      console.log('ProductForm: Product ID:', product._id || product.id);
      
      setFormData({
        _id: product._id || product.id, // Preserve the ID
        name: product.name || '',
        description: product.description || '',
        feature: product.feature || '', // Preserve feature field
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || '',
        sku: product.sku || '',
        image: product.image || '',
        images: product.images || [],
        tags: product.tags?.join(', ') || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        warranty: product.warranty || '',
        returnPolicy: product.returnPolicy || '30 days',
        showInCollection: product.showInCollection !== undefined ? product.showInCollection : true,
        showInTopSelling: product.showInTopSelling || false,
        showInNewArrival: product.showInNewArrival || false,
        showInHotDeals: product.showInHotDeals || false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleMultipleImagesUpload = (imageUrls) => {
    setFormData((prev) => {
      const currentImages = prev.images || [];
      const totalImages = currentImages.length + imageUrls.length;
      
      // Limit to maximum 5 additional images
      if (totalImages > 5) {
        const availableSlots = 5 - currentImages.length;
        const limitedUrls = imageUrls.slice(0, availableSlots);
        
        Swal.fire({
          icon: 'warning',
          title: 'Image Limit Reached',
          text: `You can only upload ${availableSlots} more image(s). Maximum 5 additional images allowed.`,
          confirmButtonColor: '#3b82f6'
        });
        
        return {
          ...prev,
          images: [...currentImages, ...limitedUrls]
        };
      }
      
      return {
        ...prev,
        images: [...currentImages, ...imageUrls]
      };
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Category *
          </label>
          <div className="space-y-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            
            {/* Add New Category Button */}
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="w-full px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              {showAddCategory ? 'Cancel' : 'Add New Category'}
            </button>

            {/* Add Category Input */}
            {showAddCategory && (
              <div className="flex gap-2 p-3 bg-blue-50 rounded-lg">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewCategory())}
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Enter new category name"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter brand name"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Original Price ($)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="0.00"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="PROD-001"
          />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Weight (kg)
          </label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="1.5"
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Dimensions (L x W x H)
          </label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="10 x 5 x 3 cm"
          />
        </div>

        {/* Warranty */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Warranty
          </label>
          <input
            type="text"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="1 Year"
          />
        </div>

        {/* Return Policy */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Return Policy
          </label>
          <select
            name="returnPolicy"
            value={formData.returnPolicy}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="7 days">7 Days</option>
            <option value="15 days">15 Days</option>
            <option value="30 days">30 Days</option>
            <option value="No return">No Return</option>
          </select>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="new, trending, sale"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter product description"
          />
        </div>

        {/* Feature Text */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-2">
            Feature Text
            <span className="text-gray-500 text-xs ml-2">(Displayed on product card below title)</span>
          </label>
          <input
            type="text"
            name="feature"
            value={formData.feature}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="e.g., Best Quality, Free Shipping, Limited Edition"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Short feature text that appears below the product title on homepage cards
          </p>
        </div>

        {/* Image Uploader */}
        <div className="md:col-span-2">
          <ImageUploader
            onImageUpload={handleImageUpload}
            onMultipleImagesUpload={handleMultipleImagesUpload}
            mainImage={formData.image}
            additionalImages={formData.images}
            onRemoveImage={removeImage}
          />
        </div>

        {/* Display Options */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black mb-3">
            Display Settings
          </label>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Show in Collection */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showInCollection"
                name="showInCollection"
                checked={formData.showInCollection}
                onChange={(e) => setFormData(prev => ({ ...prev, showInCollection: e.target.checked }))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="showInCollection" className="flex-1 cursor-pointer">
                <span className="text-sm font-semibold text-gray-800">1. Show in Collection Page</span>
                <p className="text-xs text-gray-600">Display this product in the Featured Collections section (Default)</p>
              </label>
            </div>

            {/* Show in Top Selling */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showInTopSelling"
                name="showInTopSelling"
                checked={formData.showInTopSelling}
                onChange={(e) => setFormData(prev => ({ ...prev, showInTopSelling: e.target.checked }))}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <label htmlFor="showInTopSelling" className="flex-1 cursor-pointer">
                <span className="text-sm font-semibold text-gray-800">2. Show in Top Selling</span>
                <p className="text-xs text-gray-600">Display this product in the Top Sales section</p>
              </label>
            </div>

            {/* Show in New Arrival */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showInNewArrival"
                name="showInNewArrival"
                checked={formData.showInNewArrival}
                onChange={(e) => setFormData(prev => ({ ...prev, showInNewArrival: e.target.checked }))}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <label htmlFor="showInNewArrival" className="flex-1 cursor-pointer">
                <span className="text-sm font-semibold text-gray-800">3. New Arrival</span>
                <p className="text-xs text-gray-600">Display this product in the New Arrivals section</p>
              </label>
            </div>

            {/* Show in Hot Deals */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showInHotDeals"
                name="showInHotDeals"
                checked={formData.showInHotDeals}
                onChange={(e) => setFormData(prev => ({ ...prev, showInHotDeals: e.target.checked }))}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
              />
              <label htmlFor="showInHotDeals" className="flex-1 cursor-pointer">
                <span className="text-sm font-semibold text-gray-800">4. Hot Deals</span>
                <p className="text-xs text-gray-600">Display this product in the Hot Deals section with special pricing</p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
