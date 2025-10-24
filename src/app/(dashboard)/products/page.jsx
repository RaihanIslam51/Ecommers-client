'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FiPackage, 
  FiTrendingUp, 
  FiAlertTriangle,
  FiLayers,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiStar,
  FiEye,
  FiShoppingCart
} from 'react-icons/fi';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample data - replace with your actual data
  const stats = [
    {
      title: 'Total Products',
      value: '1,247',
      change: '+23',
      icon: FiPackage,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Products',
      value: '1,189',
      change: '+12',
      icon: FiTrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Low Stock',
      value: '34',
      change: '-5',
      icon: FiAlertTriangle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Categories',
      value: '58',
      change: '+3',
      icon: FiLayers,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: '$129.99',
      stock: 45,
      sold: 234,
      rating: 4.5,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/4F46E5/ffffff?text=Headphones'
    },
    {
      id: 2,
      name: 'Smart Watch Pro Series',
      category: 'Electronics',
      price: '$299.99',
      stock: 23,
      sold: 156,
      rating: 4.8,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/10B981/ffffff?text=Watch'
    },
    {
      id: 3,
      name: 'Premium Leather Wallet',
      category: 'Accessories',
      price: '$49.99',
      stock: 8,
      sold: 89,
      rating: 4.3,
      status: 'low-stock',
      image: 'https://via.placeholder.com/300x300/F59E0B/ffffff?text=Wallet'
    },
    {
      id: 4,
      name: 'Running Shoes Ultra',
      category: 'Footwear',
      price: '$89.99',
      stock: 67,
      sold: 445,
      rating: 4.7,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/EF4444/ffffff?text=Shoes'
    },
    {
      id: 5,
      name: 'Portable Power Bank 20000mAh',
      category: 'Electronics',
      price: '$39.99',
      stock: 0,
      sold: 678,
      rating: 4.6,
      status: 'out-of-stock',
      image: 'https://via.placeholder.com/300x300/8B5CF6/ffffff?text=PowerBank'
    },
    {
      id: 6,
      name: 'Designer Sunglasses',
      category: 'Accessories',
      price: '$159.99',
      stock: 34,
      sold: 123,
      rating: 4.4,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/06B6D4/ffffff?text=Sunglasses'
    },
    {
      id: 7,
      name: 'Yoga Mat Premium',
      category: 'Fitness',
      price: '$34.99',
      stock: 89,
      sold: 267,
      rating: 4.5,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/14B8A6/ffffff?text=YogaMat'
    },
    {
      id: 8,
      name: 'Coffee Maker Deluxe',
      category: 'Home & Kitchen',
      price: '$199.99',
      stock: 12,
      sold: 89,
      rating: 4.9,
      status: 'active',
      image: 'https://via.placeholder.com/300x300/F97316/ffffff?text=Coffee'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
      'low-stock': 'bg-orange-100 text-orange-700 ring-1 ring-orange-600/20',
      'out-of-stock': 'bg-red-100 text-red-700 ring-1 ring-red-600/20'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all shadow-sm">
            <FiPlus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} <span className="font-normal text-gray-500">this month</span>
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 z-10">
                {getStatusBadge(product.status)}
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                <button className="p-3 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">
                  <FiEye className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">
                  <FiEdit className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{product.sold} sold</span>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className={`text-sm font-semibold ${product.stock > 20 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {product.stock} units
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all">
                  Edit Product
                </button>
                <button className="p-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">1-8</span> of <span className="font-semibold text-gray-900">1,247</span> products
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-blue-600 rounded-lg hover:shadow-lg transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;