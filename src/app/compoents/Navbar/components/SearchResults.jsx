'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaHeart, FaSearch, FaStar } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useCart } from '@/context/CartContext';
import Swal from 'sweetalert2';

const SearchResults = ({ query, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (query && query.trim().length >= 2) {
      searchProducts(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const searchProducts = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/products/search/${encodeURIComponent(searchQuery)}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleAddToWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    
    if (isInWishlist(productId)) {
      Swal.fire({
        icon: 'info',
        title: 'Already in Wishlist',
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

  if (!query || query.trim().length < 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center z-50">
        <FaSearch className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Type at least 2 characters to search...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8 z-50">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center z-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center z-50">
        <FaSearch className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">No products found</p>
        <p className="text-sm text-gray-500">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h3 className="font-bold text-gray-900">Search Results</h3>
          <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close search"
        >
          <MdClose className="text-xl text-gray-600" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const productId = product._id || product.id;
          const inWishlist = isInWishlist(productId);

          return (
            <Link
              key={productId}
              href={`/products/${productId}`}
              onClick={onClose}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name || 'Product'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-bold rounded">
                    {product.badge}
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleAddToWishlist(product, e)}
                    className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors ${
                      inWishlist ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    <FaHeart className="text-sm" />
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <FaShoppingCart className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm group-hover:text-black">
                  {product.name}
                </h4>
                
                {/* Category & Brand */}
                <div className="flex items-center gap-2 mb-2">
                  {product.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                  )}
                  {product.brand && (
                    <span className="text-xs text-gray-500">
                      • {product.brand}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-black">
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${parseFloat(product.originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock */}
                {product.stock && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold text-green-600">{product.stock}</span> in stock
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Results */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => {
            router.push(`/store?search=${encodeURIComponent(query)}`);
            onClose();
          }}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          View All Results in Store
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
