'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

const ImageUploader = ({ 
  onImageUpload, 
  onMultipleImagesUpload, 
  mainImage, 
  additionalImages = [],
  onRemoveImage 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const multipleFileInputRef = useRef(null);

  // ImgBB API Key - Replace with your actual API key
  const IMGBB_API_KEY = 'f2682b8754781338badc3f21b66dfce2';

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      throw new Error('Failed to upload image to ImgBB');
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const imageUrl = await uploadToImgBB(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onImageUpload(imageUrl);
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check current number of images
    const currentImageCount = additionalImages.length;
    const availableSlots = 5 - currentImageCount;

    // If already at max, show error and return
    if (availableSlots === 0) {
      setError('Maximum 5 additional images allowed. Please remove some images first.');
      setTimeout(() => setError(''), 3000);
      e.target.value = ''; // Reset input
      return;
    }

    // Limit files to available slots
    const filesToUpload = files.slice(0, availableSlots);

    // Validate all files before upload
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        setError('All files must be images');
        setTimeout(() => setError(''), 3000);
        e.target.value = ''; // Reset input
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        setTimeout(() => setError(''), 3000);
        e.target.value = ''; // Reset input
        return;
      }
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const uploadPromises = filesToUpload.map((file) => {
        return uploadToImgBB(file).then((url) => {
          setUploadProgress((prev) => prev + (100 / filesToUpload.length));
          return url;
        });
      });

      const imageUrls = await Promise.all(uploadPromises);
      onMultipleImagesUpload(imageUrls);
      
      // Show success message with count
      if (files.length > availableSlots) {
        setTimeout(() => {
          setError(`✅ ${filesToUpload.length} image(s) uploaded successfully. (Maximum 5 total)`);
          setTimeout(() => setError(''), 3000);
        }, 500);
      } else {
        setTimeout(() => {
          setError(`✅ ${filesToUpload.length} image(s) uploaded successfully!`);
          setTimeout(() => setError(''), 2000);
        }, 500);
      }
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input after upload
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Product Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Product Image
        </label>
        <div className="flex items-start gap-4">
          {mainImage ? (
            <div className="relative w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt="Main product"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onImageUpload('')}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-500 mt-2">Upload Image</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Upload main product image (Max 5MB)
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors text-sm"
            >
              {uploading ? 'Uploading...' : 'Choose Image'}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Images */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Images
          </label>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {additionalImages.length} / 5 images
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {additionalImages.map((image, index) => (
            <div key={index} className="relative w-full h-24 border-2 border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {additionalImages.length < 5 && (
            <div
              onClick={() => multipleFileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
        </div>
        <input
          ref={multipleFileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleImagesUpload}
          className="hidden"
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => multipleFileInputRef.current?.click()}
            disabled={uploading || additionalImages.length >= 5}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {uploading ? 'Uploading...' : additionalImages.length >= 5 ? 'Maximum Reached' : `Add Images (${5 - additionalImages.length} slots left)`}
          </button>
          {additionalImages.length >= 5 && (
            <span className="text-xs text-orange-600 font-medium">
              ⚠️ Maximum 5 images reached
            </span>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
        <p className="font-medium mb-1">Image Upload Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Upload high-quality images for better product presentation</li>
          <li>Supported formats: JPG, PNG, GIF</li>
          <li>Maximum file size: 5MB per image</li>
          <li>Recommended dimensions: 800x800px or higher</li>
          <li>You can upload up to 5 additional images</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;
