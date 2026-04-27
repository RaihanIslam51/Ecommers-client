'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiImage, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import Image from 'next/image';

const DEFAULT_RIGHT_BANNER = {
  title: 'Fresh Vegetables & Meal Kits',
  subtitle: '🍎 Organic & Hygienic',
  description: 'Discover fresh, organic vegetables and ready-to-cook meal packages. Hygienically prepared for your healthy lifestyle.',
  buttonText: 'Shop Now',
  buttonLink: '/store',
  image: '',
  position: 'right',
  isActive: true,
  order: 0
};

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'left', 'right'

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    position: 'left', // 'left' or 'right'
    isActive: true,
    order: 0
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/banners');
      // Server returns: { success: true, message: "...", banners: [...] }
      if (response.data.success) {
        setBanners(response.data.banners || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch banners'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Debug log for position changes
    if (name === 'position') {
      console.log('🎯 Position changed to:', newValue);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file'
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 10MB'
      });
      return;
    }

    setImageFile(file);
    setUploadingImage(true);

    try {
      // Create FormData for ImgBB
      const formData = new FormData();
      formData.append('image', file);

      // Upload to ImgBB
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=f2682b8754781338badc3f21b66dfce2`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Image uploaded successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.'
      });
      setImageFile(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      image: '',
      position: 'left',
      isActive: true,
      order: 0
    });
    setEditingBanner(null);
    setImageFile(null);
    setUploadingImage(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Title and Image are required'
      });
      return;
    }

    console.log('📤 Submitting banner with data:', formData);

    try {
      let response;
      if (editingBanner) {
        response = await axiosInstance.put(`/banners/${editingBanner._id}`, formData);
      } else {
        response = await axiosInstance.post('/banners', formData);
      }

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchBanners();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save banner'
      });
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      image: banner.image || '',
      position: banner.position || 'left',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      order: banner.order || 0
    });
    setShowAddModal(true);
  };

  const handleDelete = async (bannerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This banner will be permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/banners/${bannerId}`);
        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Banner has been deleted.',
            timer: 1500,
            showConfirmButton: false
          });
          fetchBanners();
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete banner'
        });
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const response = await axiosInstance.put(`/banners/${banner._id}`, {
        ...banner,
        isActive: !banner.isActive
      });

      if (response.data.success) {
        fetchBanners();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully!`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error toggling banner:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update banner status'
      });
    }
  };

  const filteredBanners = banners.filter(banner => {
    if (activeTab === 'all') return true;
    return banner.position === activeTab;
  });

  const leftBanners = banners.filter(b => b.position === 'left');
  const rightBanners = banners.filter(b => b.position === 'right');

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="w-full container mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-black mb-2 tracking-tight">Banner Management</h1>
              <p className="text-gray-600 font-light">Manage your homepage banners (Left & Right sections)</p>
              <p className="text-xs text-gray-500 font-light mt-2">
                📸 Images automatically hosted on ImgBB
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setFormData(prev => ({ ...prev, position: 'left' }));
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light"
              >
                <FiPlus className="text-xl" />
                Left Banner
              </button>
              <button
                onClick={() => {
                  setFormData(DEFAULT_RIGHT_BANNER);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light"
              >
                <FiPlus className="text-xl" />
                Right Banner
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 hover:border-black p-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-light uppercase tracking-widest">Total Banners</p>
                  <p className="text-3xl font-light text-black mt-2">{banners.length}</p>
                </div>
                <FiImage className="text-3xl text-black opacity-60" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 hover:border-black p-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-light uppercase tracking-widest">Left Banners</p>
                  <p className="text-3xl font-light text-black mt-2">{leftBanners.length}</p>
                </div>
                <MdOutlineKeyboardArrowLeft className="text-3xl text-black opacity-60" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 hover:border-black p-6 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-light uppercase tracking-widest">Right Banners</p>
                  <p className="text-3xl font-light text-black mt-2">{rightBanners.length}</p>
                </div>
                <MdOutlineKeyboardArrowRight className="text-3xl text-black opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 border-b-2 font-light text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Banners ({banners.length})
              </button>
              <button
                onClick={() => setActiveTab('left')}
                className={`py-4 px-6 border-b-2 font-light text-sm transition-colors ${
                  activeTab === 'left'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Left Banners ({leftBanners.length})
              </button>
              <button
                onClick={() => setActiveTab('right')}
                className={`py-4 px-6 border-b-2 font-light text-sm transition-colors ${
                  activeTab === 'right'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Right Banners ({rightBanners.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Banners List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-light text-black mb-2">{activeTab === 'all' 
                ? 'No Banners Found' 
                : `No ${activeTab} banners found`}</h3>
            <p className="text-gray-600 font-light mb-6">
              {activeTab === 'all' 
                ? 'Create your first banner to get started'
                : `No ${activeTab} banners found. Create one now!`}
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-all font-light"
            >
              <FiPlus className="text-xl" />
              Add New Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBanners.map((banner) => (
              <div key={banner._id} className="bg-white border border-gray-200 hover:border-black transition-colors overflow-hidden">
                {/* Banner Preview */}
                <div className="relative h-48 bg-gray-100">
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FiImage className="text-6xl text-gray-300" />
                    </div>
                  )}
                  
                  {/* Position Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 border text-xs font-light ${
                      banner.position === 'left'
                        ? 'border-black text-black bg-white'
                        : 'border-black text-black bg-white'
                    }`}>
                      {banner.position === 'left' ? 'Left' : 'Right'}
                    </span>
                  </div>

                  {/* Active Status */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 border text-xs font-light ${
                      banner.isActive
                        ? 'border-black text-black bg-white'
                        : 'border-gray-400 text-gray-400 bg-white'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Banner Details */}
                <div className="p-6">
                  <h3 className="text-lg font-light text-black mb-1">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-600 font-light mb-2">{banner.subtitle}</p>
                  )}
                  {banner.description && (
                    <p className="text-sm text-gray-600 font-light mb-3 line-clamp-2">{banner.description}</p>
                  )}
                  
                  {banner.buttonText && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-500 font-light">Button: </span>
                      <span className="text-sm font-light text-black">{banner.buttonText}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex items-center gap-2 px-4 py-2 border transition-all font-light text-sm ${
                        banner.isActive
                          ? 'border-gray-200 text-black hover:border-black hover:bg-black hover:text-white'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                      title={banner.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {banner.isActive ? <FiEyeOff /> : <FiEye />}
                      {banner.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light text-sm ml-auto"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-black">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <span className={`px-4 py-2 border text-sm font-light ${
                  formData.position === 'left' 
                    ? 'border-black text-black bg-white' 
                    : 'border-black text-black bg-white'
                }`}>
                  {formData.position === 'left' ? '← Left Banner' : 'Right Banner →'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hidden Position Field */}
              <input type="hidden" name="position" value={formData.position} />

              {/* Image Upload */}
              <div>
                <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                  Banner Image *
                </label>
                <div className="border border-gray-200 p-8 text-center hover:border-black transition-colors">
                  {uploadingImage ? (
                    <div className="py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600 font-light">Uploading to ImgBB...</p>
                    </div>
                  ) : formData.image ? (
                    <div className="relative">
                      <div className="relative h-48 mb-4">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs text-black font-light mb-3">✓ Hosted on ImgBB</p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image: '' }));
                          setImageFile(null);
                        }}
                        className="text-sm text-gray-600 hover:text-black font-light transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiImage className="text-5xl text-gray-300 mx-auto mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-black hover:text-gray-700 font-light transition-colors">
                          Upload to ImgBB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <p className="text-xs text-gray-500 font-light mt-2">PNG, JPG, GIF up to 10MB</p>
                      <p className="text-xs text-gray-400 font-light mt-1">Images will be automatically uploaded to ImgBB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Only show Title, Subtitle, Description, and Buttons for Left Banner */}
              {formData.position === 'left' && (
                <>
                  {/* Title */}
                  <div>
                    <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Special Offer!"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      placeholder="e.g., Up to 50% Off"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Banner description..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                    />
                  </div>

                  {/* Button Text & Link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                        Button Text
                      </label>
                      <input
                        type="text"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleInputChange}
                        placeholder="e.g., Shop Now"
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                        Button Link
                      </label>
                      <input
                        type="text"
                        name="buttonLink"
                        value={formData.buttonLink}
                        onChange={handleInputChange}
                        placeholder="e.g., /products"
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                      />
                    </div>
                  </div>

                  {/* Order & Active Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none font-light"
                      />
                      <p className="text-xs text-gray-500 font-light mt-2">Lower numbers appear first</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 font-light uppercase tracking-widest mb-3">
                        Status
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors">
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-black"
                        />
                        <span className="font-light text-black">Active (Show on website)</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={uploadingImage}
                  className="flex-1 px-6 py-3 border border-gray-200 text-black hover:border-black hover:bg-black hover:text-white transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage || !formData.image}
                  className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
