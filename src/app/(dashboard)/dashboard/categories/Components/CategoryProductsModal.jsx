'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Edit, Trash2, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';

/**
 * Category Products Modal - View and manage products in a category
 */
const CategoryProductsModal = ({ isOpen, onClose, category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (isOpen && category) {
      fetchCategoryProducts();
    }
  }, [isOpen, category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      if (response.data && response.data.products) {
        // Filter products by category
        const categoryProducts = response.data.products.filter(
          product => product.category === category.name
        );
        setProducts(categoryProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load products',
        text: error.response?.data?.message || 'Please try again',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id || p.id));
    }
  };

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete "${product.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const id = product._id || product.id;
        await axiosInstance.delete(`/products/${id}`);
        await fetchCategoryProducts();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Product has been deleted',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete',
          text: error.response?.data?.message || 'Please try again',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    const result = await Swal.fire({
      title: 'Delete Selected Products?',
      text: `Delete ${selectedProducts.length} products? This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedProducts.map(id => axiosInstance.delete(`/products/${id}`))
        );
        await fetchCategoryProducts();
        setSelectedProducts([]);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${selectedProducts.length} products deleted`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting products:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete',
          text: 'Some products could not be deleted',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleEditProduct = (product) => {
    // Redirect to products page with edit modal
    window.location.href = `/dashboard/products?edit=${product._id || product.id}`;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name?.localeCompare(b.name);
        case 'name-desc':
          return b.name?.localeCompare(a.name);
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {category?.name} Products
                  </h2>
                  <p className="text-sm text-blue-100">
                    {filteredProducts.length} products in this category
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock">Stock: Low to High</option>
                  <option value="stock-desc">Stock: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {selectedProducts.length} selected
                  </span>
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
              </div>
            )}
          </div>

          {/* Products List */}
          <div className="overflow-y-auto max-h-[calc(90vh-250px)] p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Try adjusting your search'
                    : 'This category has no products yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const productId = product._id || product.id;
                  const isSelected = selectedProducts.includes(productId);

                  return (
                    <div
                      key={productId}
                      className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-lg ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                      }`}
                    >
                      {/* Product Image */}
                      <div className="relative h-40 bg-gray-100">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectProduct(productId)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
                          />
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-10">
                          {product.description || 'No description'}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            ${product.price?.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.originalPrice?.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold">{filteredProducts.length}</span> products
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsModal;
