'use client';
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHeart, FaEye } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import Swal from 'sweetalert2';

const StoreProductCard = ({ product, viewType = 'grid' }) => {
  const router = useRouter();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = product._id || product.id;
  const productImage = product.image || 'https://via.placeholder.com/300';
  const productName = product.name || 'Product Name';
  const productDescription = product.description || '';
  const salePrice = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const stock = product.stock || 0;

  const discountPercent =
    originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (stock === 0) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart(product);
      Swal.fire({ icon: 'success', title: 'Added to Cart!', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
      setIsAddingToCart(false);
    }, 400);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      Swal.fire({ icon: 'info', title: 'Already in Wishlist', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
    } else {
      addToWishlist(product);
      Swal.fire({ icon: 'success', title: 'Added to Wishlist!', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
    }
  };

  const handleBuyNow = useCallback((e) => {
    e.stopPropagation();
    const productData = encodeURIComponent(JSON.stringify(product));
    router.push(`/quick-checkout?product=${productData}`);
  }, [product, router]);

  /* ─── LIST VIEW ────────────────────────────────────────── */
  if (viewType === 'list') {
    return (
      <div
        className="group relative flex flex-col sm:flex-row bg-white border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
        onClick={() => router.push(`/products/${productId}`)}
      >
        <div className="relative w-full sm:w-48 h-48 shrink-0 bg-gray-50">
          <Image src={productImage} alt={productName} fill className="object-cover" sizes="(max-width: 640px) 100vw, 192px" />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
              -{discountPercent}%
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
            <p className="text-xs font-semibold text-black line-clamp-2 leading-snug mb-2">{productName}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{productDescription}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-black">${salePrice.toFixed(2)}</span>
              {originalPrice > salePrice && (
                <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-red-500">-{discountPercent}%</span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0 || isAddingToCart}
              className="flex-1 py-2 text-xs font-semibold text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Adding…' : 'Add to Cart'}
            </button>
            {stock > 0 && (
              <button
                onClick={handleBuyNow}
                className="flex-1 py-2 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Buy Now
              </button>
            )}
            <button
              onClick={handleAddToWishlist}
              className="px-3 py-2 border border-gray-200 rounded-md hover:border-black transition-colors"
            >
              <FaHeart className={`text-xs ${isInWishlist(productId) ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── GRID VIEW ─────────────────────────────────────────── */
  return (
    <div
      onClick={() => router.push(`/products/${productId}`)}
      className="relative group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{ height: '320px' }}
    >
      {/* IMAGE — 75% */}
      <div className="relative w-full" style={{ flex: '0 0 75%' }}>
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Hover action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
            className="w-8 h-8 bg-white text-gray-700 hover:text-red-500 rounded-full shadow border border-gray-200 flex items-center justify-center transition-colors"
          >
            <FaHeart className={`text-xs ${isInWishlist(productId) ? 'text-red-500' : ''}`} />
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
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
            -{discountPercent}%
          </span>
        )}

        {/* Out of stock overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">Out of Stock</span>
          </div>
        )}
      </div>

      {/* INFO — 25% */}
      <div className="flex flex-col justify-center px-3 py-2 gap-1" style={{ flex: '0 0 25%' }}>
        <p className="text-xs font-semibold text-black line-clamp-1 leading-tight">{productName}</p>

        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-black">${salePrice.toFixed(2)}</span>
          {originalPrice > salePrice && (
            <span className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          )}
          {discountPercent > 0 && (
            <span className="ml-auto text-xs font-semibold text-red-500">-{discountPercent}%</span>
          )}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAddingToCart}
            className="flex-1 py-1 text-xs font-semibold text-black border border-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? 'Adding…' : 'Add to Cart'}
          </button>
          {stock > 0 && (
            <button
              onClick={handleBuyNow}
              className="flex-1 py-1 text-xs font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreProductCard;
