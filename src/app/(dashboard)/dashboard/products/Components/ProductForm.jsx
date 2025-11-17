
'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    category: '',
    subcategory: '',
    
    // Freshness & Type Details
    productType: 'Fresh',
    freshnessLevel: 'Farm Fresh',
    
    // Pricing
    price: '',
    originalPrice: '',
    discount: '',
    
    // Stock & Inventory
    stock: '',
    stockStatus: 'In Stock',
    sku: '',
    
    // Packaging Details
    netWeight: '',
    servings: '',
    packagingType: 'Airtight Pack',
    shelfLife: '',
    storageInstructions: '',
    
    // Ready-to-Cook/Meal Kit Details
    preparationTime: '',
    cookingInstructions: '',
    ingredientsList: '',
    allergenInfo: '',
    
    // Media
    image: '',
    images: [],
    
    // Tags
    tags: '',
    
    // Short Feature Text
    feature: '',
    
    // Product Description
    description: '',
    
    // Origin Information
    farmSource: '',
    originLocation: '',
    
    // Display Settings
    showInCollection: true,
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
        // icon: '📦'
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

        // Dispatch custom event to notify other components about new category
        window.dispatchEvent(new CustomEvent('categoryAdded', { 
          detail: { categoryName: newCategoryName.trim() } 
        }));
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
        _id: product._id || product.id,
        // Basic Information
        name: product.name || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        
        // Freshness & Type Details
        productType: product.productType || 'Fresh',
        freshnessLevel: product.freshnessLevel || 'Farm Fresh',
        
        // Pricing
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        discount: product.discount || '',
        
        // Stock & Inventory
        stock: product.stock || '',
        stockStatus: product.stockStatus || 'In Stock',
        sku: product.sku || '',
        
        // Packaging Details
        netWeight: product.netWeight || '',
        servings: product.servings || '',
        packagingType: product.packagingType || 'Airtight Pack',
        shelfLife: product.shelfLife || '',
        storageInstructions: product.storageInstructions || '',
        
        // Ready-to-Cook/Meal Kit Details
        preparationTime: product.preparationTime || '',
        cookingInstructions: product.cookingInstructions || '',
        ingredientsList: product.ingredientsList || '',
        allergenInfo: product.allergenInfo || '',
        
        // Media
        image: product.image || '',
        images: product.images || [],
        
        // Tags
        tags: product.tags?.join(', ') || '',
        
        // Short Feature Text
        feature: product.feature || '',
        
        // Product Description
        description: product.description || '',
        
        // Origin Information
        farmSource: product.farmSource || '',
        originLocation: product.originLocation || '',
        
        // Display Settings
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
    if (!formData.netWeight.trim()) newErrors.netWeight = 'Net weight is required';
    if (!formData.image.trim()) newErrors.image = 'Main product image is required';
    
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
      discount: formData.discount ? parseFloat(formData.discount) : null,
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">1</span>
          </span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              placeholder="Example: Fresh Cut Spinach Pack, Ready-to-Cook Veg Curry Kit"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
              {formData.category && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Selected: {formData.category}
                </span>
              )}
            </label>
            <div className="space-y-2">
              {/* Category Dropdown */}
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) {
                    Swal.fire({
                      icon: 'info',
                      title: 'Category Selected',
                      text: `Selected: ${e.target.value}`,
                      timer: 1500,
                      showConfirmButton: false,
                      toast: true,
                      position: 'top-end'
                    });
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.icon && `${cat.icon} `}{cat.name}
                  </option>
                ))}
              </select>
              
              {/* Add New Category Button */}
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="w-full px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <span className="text-xl">+</span>
                {showAddCategory ? 'Cancel' : 'Add New Category'}
              </button>

              {/* Add Category Form */}
              {showAddCategory && (
                <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              placeholder="Example: Leafy Greens, Stir-Fry, Salad Mix, etc."
            />
          </div>
        </div>
      </div>

      {/* Freshness & Type Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">🍃</span>
          </span>
          Freshness & Type Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            >
              <option value="Fresh">Fresh</option>
              <option value="Organic">Organic</option>
              <option value="Cut & Clean">Cut & Clean</option>
              <option value="Ready-to-Cook">Ready-to-Cook</option>
              <option value="Premium">Premium</option>
              <option value="Seasonal">Seasonal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Freshness Level
            </label>
            <select
              name="freshnessLevel"
              value={formData.freshnessLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
            >
              <option value="Farm Fresh">Farm Fresh</option>
              <option value="Pre-Washed">Pre-Washed</option>
              <option value="Cleaned & Sanitized">Cleaned & Sanitized</option>
              <option value="Cut & Ready">Cut & Ready</option>
              <option value="Ready-to-Cook">Ready-to-Cook</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-yellow-600 font-bold text-sm">💰</span>
          </span>
          Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (৳) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price (৳) <span className="text-gray-500">(for discount)</span>
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%) <span className="text-gray-500">(auto-calc optional)</span>
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              step="0.01"
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Stock & Inventory */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">📦</span>
          </span>
          Stock & Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <select
              name="stockStatus"
              value={formData.stockStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU Code *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black ${
                errors.sku ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Example: KNK-VEG-001"
            />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
          </div>
        </div>
      </div>

      {/* Packaging Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">⚖️</span>
          </span>
          Packaging Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Net Weight (g / kg) *
            </label>
            <input
              type="text"
              name="netWeight"
              value={formData.netWeight}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black ${
                errors.netWeight ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Example: 250g, 500g, 1kg"
            />
            {errors.netWeight && <p className="text-red-500 text-xs mt-1">{errors.netWeight}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Servings
            </label>
            <input
              type="text"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              placeholder="Example: 2 servings, 4 servings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Packaging Type
            </label>
            <select
              name="packagingType"
              value={formData.packagingType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            >
              <option value="Airtight Pack">Airtight Pack</option>
              <option value="Zip Pouch">Zip Pouch</option>
              <option value="Eco-Friendly Pack">Eco-Friendly Pack</option>
              <option value="Vacuum-Sealed">Vacuum-Sealed</option>
              <option value="Box Pack">Box Pack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shelf Life
            </label>
            <input
              type="text"
              name="shelfLife"
              value={formData.shelfLife}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              placeholder="Example: 3 Days, 24 Hours, 7 Days (Chilled)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Instructions
            </label>
            <input
              type="text"
              name="storageInstructions"
              value={formData.storageInstructions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
              placeholder="Example: Keep refrigerated between 2–8°C"
            />
          </div>
        </div>
      </div>

      {/* Ready-to-Cook/Meal Kit Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-bold text-sm">🍽️</span>
          </span>
          Ready-to-Cook/Meal Kit Details <span className="text-gray-500 text-sm">(if applicable)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preparation Time
            </label>
            <input
              type="text"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              placeholder="Example: 10 minutes, 15 minutes"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Instructions
            </label>
            <textarea
              name="cookingInstructions"
              value={formData.cookingInstructions}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              placeholder="Example:&#10;Heat oil&#10;Add vegetables&#10;Cook for 5–7 minutes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients List
            </label>
            <textarea
              name="ingredientsList"
              value={formData.ingredientsList}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              placeholder="Example:&#10;Carrot&#10;Beans&#10;Cauliflower"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergen Information
            </label>
            <textarea
              name="allergenInfo"
              value={formData.allergenInfo}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
              placeholder="Example: Contains nuts, Gluten-free, No preservatives"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-pink-600 font-bold text-sm">🖼️</span>
          </span>
          Media
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Main Image *
            </label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              onMultipleImagesUpload={handleMultipleImagesUpload}
              mainImage={formData.image}
              additionalImages={formData.images}
              onRemoveImage={removeImage}
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-600 font-bold text-sm">🔖</span>
          </span>
          Tags <span className="text-gray-500">(comma-separated)</span>
        </h3>
        <div>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
            placeholder="Examples: fresh, clean-cut, meal-kit, organic, healthy, ready-to-cook, combo"
          />
        </div>
      </div>

      {/* Short Feature Text */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
            <span className="text-cyan-600 font-bold text-sm">📢</span>
          </span>
          Short Feature Text
        </h3>
        <div>
          <input
            type="text"
            name="feature"
            value={formData.feature}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-black"
            placeholder="Examples: 'Freshly Cleaned', 'Ready in 10 Minutes', 'No Preservatives', 'Organic & Healthy'"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            Displayed on product card under title
          </p>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">📝</span>
          </span>
          Product Description
        </h3>
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black"
            placeholder="Full detailed description including freshness, taste, benefits, origin, preparation details, etc."
          />
        </div>
      </div>

      {/* Origin Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
            <span className="text-lime-600 font-bold text-sm">🌱</span>
          </span>
          Origin Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm/Source Name
            </label>
            <input
              type="text"
              name="farmSource"
              value={formData.farmSource}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-black"
              placeholder="Farm or source name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origin Location
            </label>
            <input
              type="text"
              name="originLocation"
              value={formData.originLocation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-black"
              placeholder="Example: Bogura, Kishoreganj farms, Local Market Selected"
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">⚙️</span>
          </span>
          Display Settings
        </h3>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
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
        {formData.category && (
          <button
            type="button"
            onClick={() => window.open(`/?highlight=${encodeURIComponent(formData.category)}`, '_blank')}
            className="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            title="Preview selected category in frontend"
          >
            👁️ Preview Category
          </button>
        )}
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
