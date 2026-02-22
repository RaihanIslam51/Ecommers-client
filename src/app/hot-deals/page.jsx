'use client';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useCart } from '@/context/CartContext';
import {
  FaHeart,
  FaEye,
  FaFire,
  FaThLarge,
  FaListUl,
  FaArrowLeft,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp
} from 'react-icons/fa';
import { BiSort } from 'react-icons/bi';
import Swal from 'sweetalert2';

const HotDealsPage = memo(() => {
  const router = useRouter();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('discount-high');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => { fetchHotDeals(); }, []);
  useEffect(() => { setCurrentPage(1); }, [sortBy, selectedCategory]);

  const fetchHotDeals = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      const productsData = response.data.products || [];
      const hotDealsProducts = productsData.filter(p => p.showInHotDeals === true);
      setProducts(hotDealsProducts);
      const uniqueCategories = [...new Set(hotDealsProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching hot deals:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load hot deals.', confirmButtonColor: '#000' });
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = useCallback((product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    switch (sortBy) {
      case 'discount-high': filtered.sort((a, b) => calculateDiscount(b) - calculateDiscount(a)); break;
      case 'discount-low':  filtered.sort((a, b) => calculateDiscount(a) - calculateDiscount(b)); break;
      case 'price-low':     filtered.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)); break;
      case 'price-high':    filtered.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)); break;
      case 'name':          filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
    }
    return filtered;
  }, [products, selectedCategory, sortBy, calculateDiscount]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => filteredProducts.slice(startIndex, endIndex), [filteredProducts, startIndex, endIndex]);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Swal.fire({ icon: 'success', title: 'Added to Cart!', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
  };

  const handleToggleWishlist = (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      Swal.fire({ icon: 'info', title: 'Removed from Wishlist', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
    } else {
      addToWishlist(product);
      Swal.fire({ icon: 'success', title: 'Added to Wishlist!', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-4 py-4 sm:py-5">

        {/* Header */}
        {/* <div className="border-b border-gray-100 pb-6 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-black uppercase tracking-widest mb-5 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Home</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">Deals</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight">Hot Deals</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} items</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 border transition-colors ${viewMode === 'grid' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
                title="Grid View"
              >
                <FaThLarge className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 border transition-colors ${viewMode === 'list' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
                title="List View"
              >
                <FaListUl className="text-sm" />
              </button>
            </div>
          </div>
        </div> */}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
              <FaFilter className="text-xs" /> Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors text-black"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
              <BiSort className="text-xs" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors text-black"
            >
              <option value="discount-high">Biggest Discount First</option>
              <option value="discount-low">Smallest Discount First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">—</div>
            <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-2">No Deals Found</h3>
            <p className="text-gray-500 text-sm mb-6">Check back later for amazing deals.</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
              : 'flex flex-col gap-3'
          }>
            {paginatedProducts.map((product) => {
              const productId = product._id || product.id;
              const inWishlist = isInWishlist(productId);
              const discount = calculateDiscount(product);
              const salePrice = parseFloat(product.price || 0);
              const originalPriceVal = parseFloat(product.originalPrice || 0);
              const stock = product.stock || 0;

              /* ── LIST VIEW ── */
              if (viewMode === 'list') {
                return (
                  <div
                    key={productId}
                    className="group relative flex flex-col sm:flex-row bg-white border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => router.push(`/products/${productId}`)}
                  >
                    <div className="relative w-full sm:w-48 h-48 shrink-0 bg-gray-50">
                      <Image src={product.image || 'https://via.placeholder.com/300'} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 192px" />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                          -{discount}%
                        </span>
                      )}
                      {stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                          <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-black line-clamp-2 leading-snug mb-2">{product.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description || ''}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-black">${salePrice.toFixed(2)}</span>
                          {originalPriceVal > salePrice && (
                            <span className="text-xs text-gray-400 line-through">${originalPriceVal.toFixed(2)}</span>
                          )}
                          {discount > 0 && <span className="text-xs font-semibold text-red-500">-{discount}%</span>}
                        </div>
                      </div>
                      <div className="flex gap-1.5 mt-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                          disabled={stock === 0}
                          className="flex-1 py-2 text-xs font-semibold text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                        {stock > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/quick-checkout?product=${encodeURIComponent(JSON.stringify(product))}`); }}
                            className="flex-1 py-2 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                          >
                            Buy Now
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                          className="px-3 py-2 border border-gray-200 rounded-md hover:border-black transition-colors"
                        >
                          <FaHeart className={`text-xs ${inWishlist ? 'text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              /* ── GRID VIEW ── */
              return (
                <div
                  key={productId}
                  onClick={() => router.push(`/products/${productId}`)}
                  className="relative group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ height: '320px' }}
                >
                  {/* IMAGE — 75% */}
                  <div className="relative w-full" style={{ flex: '0 0 75%' }}>
                    <Image
                      src={product.image || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Hover buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                        title="Add to Wishlist"
                        className="w-8 h-8 bg-white text-gray-700 hover:text-red-500 rounded-full shadow border border-gray-200 flex items-center justify-center transition-colors"
                      >
                        <FaHeart className={`text-xs ${inWishlist ? 'text-red-500' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/products/${productId}`); }}
                        title="View Product"
                        className="w-8 h-8 bg-white text-gray-700 hover:text-blue-500 rounded-full shadow border border-gray-200 flex items-center justify-center transition-colors"
                      >
                        <FaEye className="text-xs" />
                      </button>
                    </div>

                    {/* Discount badge */}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                        -{discount}%
                      </span>
                    )}

                    {/* Hot badge */}
                    {discount > 0 && (
                      <span className="absolute bottom-2 left-2 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                        <FaFire className="text-red-400 text-xs" /> HOT
                      </span>
                    )}

                    {/* Out of stock */}
                    {stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* INFO — 25% */}
                  <div className="flex flex-col justify-center px-3 py-2 gap-1" style={{ flex: '0 0 25%' }}>
                    <p className="text-xs font-semibold text-black line-clamp-1 leading-tight">{product.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-black">${salePrice.toFixed(2)}</span>
                      {originalPriceVal > salePrice && (
                        <span className="text-xs text-gray-400 line-through">${originalPriceVal.toFixed(2)}</span>
                      )}
                      {discount > 0 && (
                        <span className="ml-auto text-xs font-semibold text-red-500">-{discount}%</span>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        disabled={stock === 0}
                        className="flex-1 py-1 text-xs font-semibold text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      {stock > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/quick-checkout?product=${encodeURIComponent(JSON.stringify(product))}`); }}
                          className="flex-1 py-1 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {startIndex + 1}–{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 text-black hover:bg-black hover:text-white hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[36px] px-2 py-2 text-sm font-medium border transition-colors ${
                    page === currentPage
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 text-black hover:bg-black hover:text-white hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* Back to Top */}
        {filteredProducts.length > 12 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Back to Top
              <FaArrowUp className="text-xs" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
});

HotDealsPage.displayName = 'HotDealsPage';

export default HotDealsPage;
