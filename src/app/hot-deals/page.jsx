'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { useCart } from '@/context/CartContext';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaStar,
  FaFire,
  FaClock,
  FaThLarge,
  FaListUl,
  FaArrowLeft,
  FaFilter
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { BiSort } from 'react-icons/bi';
import Swal from 'sweetalert2';

const HotDealsPage = () => {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('discount-high');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchHotDeals();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, selectedCategory]);

  const fetchHotDeals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      
      // Filter products that are marked as Hot Deals
      const hotDealsProducts = response.data.filter(p => p.showInHotDeals === true);
      
      setProducts(hotDealsProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(hotDealsProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching hot deals:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load hot deals. Please try again.',
        confirmButtonColor: '#000'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'discount-high':
        filtered.sort((a, b) => calculateDiscount(b) - calculateDiscount(a));
        break;
      case 'discount-low':
        filtered.sort((a, b) => calculateDiscount(a) - calculateDiscount(b));
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

    setFilteredProducts(filtered);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading hot deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaFire className="text-4xl text-red-600 animate-pulse" />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Hot Deals
                </h1>
              </div>
              <p className="text-gray-700 font-medium">
                🔥 Limited time offers - Save big today! ({filteredProducts.length} deals)
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <FaListUl />
              </button>
            </div>
          </div>
        </div>

        {/* Deal Timer Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FaClock className="text-3xl animate-pulse" />
              <div>
                <h3 className="text-xl font-bold">Deals End Soon!</h3>
                <p className="text-red-100">Don't miss out on these amazing offers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-red-100">Average Savings</p>
              <p className="text-3xl font-bold">
                {products.length > 0 
                  ? Math.round(products.reduce((acc, p) => acc + calculateDiscount(p), 0) / products.length)
                  : 0}% OFF
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaFilter />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                <BiSort />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="discount-high">Biggest Discount First</option>
                <option value="discount-low">Smallest Discount First</option>
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
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hot deals available</h3>
            <p className="text-gray-600 mb-6">Check back later for amazing deals and discounts!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const inWishlist = isInWishlist(productId);
              const discount = calculateDiscount(product);

              if (viewMode === 'list') {
                // List View
                return (
                  <div key={productId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all border-2 border-red-200">
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
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hot Deal Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                            <FaFire /> HOT DEAL
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="absolute top-2 right-2">
                            <span className="px-3 py-1 bg-red-600 text-white text-lg font-bold rounded-full shadow-lg">
                              -{discount}%
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link href={`/products/${productId}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 line-clamp-2 transition-colors">
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
                            {product.brand && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                <MdVerified className="text-xs" />
                                {product.brand}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {product.description || product.feature || 'No description available'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-2xl font-bold text-red-600">
                                ${parseFloat(product.price || 0).toFixed(2)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg text-gray-400 line-through">
                                  ${parseFloat(product.originalPrice).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {discount > 0 && (
                              <p className="text-sm text-green-600 font-semibold">
                                You save ${(parseFloat(product.originalPrice || 0) - parseFloat(product.price || 0)).toFixed(2)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleWishlist(product)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                inWishlist
                                  ? 'border-red-500 text-red-500 bg-red-50'
                                  : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                              }`}
                            >
                              <FaHeart className={inWishlist ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock <= 0}
                              className="px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
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
                <div key={productId} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-red-100 hover:border-red-300">
                  {/* Image */}
                  <Link href={`/products/${productId}`} className="relative block w-full h-64 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Hot Deal Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                        <FaFire /> HOT
                      </span>
                    </div>
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3">
                        <div className="relative">
                          <span className="block px-3 py-1 bg-red-600 text-white text-xl font-bold rounded-full shadow-lg animate-bounce">
                            -{discount}%
                          </span>
                        </div>
                      </div>
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
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
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
                        className="p-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg backdrop-blur-sm hover:from-red-700 hover:to-orange-700 shadow-lg transition-all disabled:bg-gray-400"
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
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors min-h-[3rem]">
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
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-red-600">
                          ${parseFloat(product.price || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${parseFloat(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <p className="text-xs text-green-600 font-semibold">
                          Save ${(parseFloat(product.originalPrice || 0) - parseFloat(product.price || 0)).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-3">
                      {product.stock > 0 ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs text-green-700 font-medium">In Stock - Hurry!</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span className="text-xs text-red-700 font-medium">Sold Out</span>
                        </>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                    >
                      {product.stock > 0 ? 'Grab This Deal!' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Top */}
        {filteredProducts.length > 12 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg"
            >
              Back to Top ↑
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotDealsPage;
