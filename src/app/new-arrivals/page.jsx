'use client';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { useCart } from '@/context/CartContext';
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaFilter,
  FaThLarge,
  FaListUl,
  FaArrowLeft,
  FaMagic,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { BiSort } from 'react-icons/bi';
import Swal from 'sweetalert2';

const NewArrivalsPage = memo(() => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, selectedCategory]);

  const calculateDiscount = useCallback((product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      
      // Server returns: { success: true, message: "...", products: [...] }
      const productsData = response.data.products || [];
      
      // Filter products that are marked as New Arrivals
      const newArrivalProducts = productsData.filter(p => p.showInNewArrival === true);
      
      // Sort by creation date (newest first) if available
      const sortedProducts = newArrivalProducts.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
      
      setProducts(sortedProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(sortedProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load products. Please try again.',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        break;
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  // Paginated products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleToggleWishlist = (product) => {
    const productId = product._id || product.id;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      Swal.fire({
        icon: 'info',
        title: 'Removed from Wishlist',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      addToWishlist(product);
      Swal.fire({
        icon: 'success',
        title: 'Added to Wishlist!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Discovering new arrivals...</p>
          <div className="mt-4 flex justify-center">
            <FaMagic className="text-purple-500 text-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <FaMagic className="text-purple-500 text-2xl sm:text-4xl animate-pulse" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  New Arrivals
                </h1>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                ✨ Fresh products just arrived! Discover the latest trends ({filteredProducts.length} items)
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 sm:p-3 rounded-lg transition-all touch-manipulation ${
                  viewMode === 'grid'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                }`}
                title="Grid View"
              >
                <FaThLarge className="text-sm sm:text-base" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 sm:p-3 rounded-lg transition-all touch-manipulation ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                }`}
                title="List View"
              >
                <FaListUl className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hidden lg:block md:block text-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <FaMagic className="text-2xl sm:text-3xl animate-bounce" />
                <h2 className="text-xl sm:text-2xl font-bold">Fresh Collection Alert!</h2>
              </div>
              <p className="text-purple-100 text-sm sm:text-base mb-4 max-w-md">
                Be the first to explore our handpicked selection of trending products.
                Limited stock available - shop now before they&apos;re gone!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>New arrivals daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Exclusive deals</span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-purple-200 mb-1">Total New Items</p>
              <p className="text-3xl sm:text-4xl font-bold">{products.length}</p>
              <p className="text-sm text-purple-200 mt-1">Available now</p>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8 border border-purple-100">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaFilter className="text-purple-600" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <BiSort className="text-purple-600" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent touch-manipulation transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try changing your filters or check back later for new arrivals.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'
              : 'space-y-3 sm:space-y-4'
          }>
            {paginatedProducts.map((product) => {
              const productId = product._id || product.id;
              const inWishlist = isInWishlist(productId);
              const discount = calculateDiscount(product);

              if (viewMode === 'list') {
                // List View
                return (
                  <div key={productId} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      {/* Image */}
                      <Link 
                        href={`/products/${productId}`}
                        className="relative w-full sm:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group"
                      >
                        <Image
                          src={product.image || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          fill
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                            {product.badge}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="absolute top-2 right-2 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link href={`/products/${productId}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-black line-clamp-2">
                                {product.name}
                              </h3>
                            </Link>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {product.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {product.category}
                              </span>
                            )}
                            {/* {product.brand && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                <MdVerified className="text-xs" />
                                {product.brand}
                              </span>
                            )} */}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {product.description || product.feature || 'No description available'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-black">
                              ${parseFloat(product.price || 0).toFixed(2)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-lg text-gray-400 line-through">
                                ${parseFloat(product.originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleWishlist(product)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                inWishlist
                                  ? 'border-green-500 text-green-500 bg-green-50'
                                  : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-500'
                              }`}
                            >
                              <FaHeart className={inWishlist ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock <= 0}
                              className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <FaShoppingCart />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Grid View
              return (
                <div key={productId} className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <Link href={`/products/${productId}`} className="relative block w-full h-64 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-lg">
                        {product.badge}
                      </span>
                    )}
                    
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-lg">
                        -{discount}% OFF
                      </span>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleWishlist(product);
                        }}
                        className={`p-2.5 rounded-lg backdrop-blur-sm shadow-lg transition-all ${
                          inWishlist
                            ? 'bg-green-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        <FaHeart className={`text-sm ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        disabled={product.stock <= 0}
                        className="p-2.5 bg-black/90 text-white rounded-lg backdrop-blur-sm hover:bg-black shadow-lg transition-all disabled:bg-gray-400"
                      >
                        <FaShoppingCart className="text-sm" />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {product.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      )}
                      {product.brand && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          <MdVerified className="text-xs" />
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <Link href={`/products/${productId}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-black transition-colors min-h-[3rem]">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-black">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${parseFloat(product.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-3">
                      {product.stock > 0 ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs text-green-700 font-medium">In Stock</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span className="text-xs text-red-700 font-medium">Out of Stock</span>
                        </>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-purple-100">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-11 min-h-11"
              >
                <FaChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-manipulation min-w-11 min-h-11 ${
                      page === currentPage
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-11 min-h-11"
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Back to Top */}
        {filteredProducts.length > 12 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation min-w-11 min-h-11"
            >
              <span className="flex items-center gap-2">
                Back to Top
                <FaArrowUp className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

NewArrivalsPage.displayName = 'NewArrivalsPage';

export default NewArrivalsPage;