"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "../TopSales/components/Productcard";
import { ProductCardSkeletonGrid } from "../TopSales/components/ProductCardSkeleton";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";

const Collection = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProductId, setModalProductId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products from:', axiosInstance.defaults.baseURL);
        const response = await axiosInstance.get('/products');
        // Server returns: { success: true, message: "...", products: [...] }
        const productsData = response.data.products || [];
        console.log('✅ Products fetched:', productsData.length);
        // Filter products to show only those marked for collection
        const collectionProducts = productsData.filter(product => product.showInCollection === true);
        console.log('📦 Collection products:', collectionProducts.length);
        setProducts(collectionProducts);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Show user-friendly error message
        if (error.code === 'ERR_NETWORK') {
          console.error('⚠️ Network Error: Cannot connect to server. Is the backend running on port 5000?');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const modalProduct = products.find((p) => (p._id || p.id) === modalProductId);

  // Default: 24 products
  const displayedProducts = showAll ? products : products.slice(0, 24);

  return (
    <section className="w-full bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading ? (
          <div>
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
              <div className="space-y-3">
                <div className="h-8 md:h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-80 md:w-96 bg-gray-100 rounded animate-pulse animation-delay-100" />
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse animation-delay-200" />
            </div>
            
            {/* Product Cards Skeleton */}
            <ProductCardSkeletonGrid count={24} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 lg:mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 md:h-10 bg-green-600 rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">Fresh Collections</h2>
                </div>
                <p className="text-sm md:text-base text-gray-600 ml-4 lg:ml-5">Discover our ready-to-cook meal kits and healthy food combos</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm text-gray-500">
                  {displayedProducts.length} of {products.length} items
                </span>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-green-600 border border-green-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all duration-200"
                  disabled={products.length <= 24}
                >
                <span>{showAll ? 'Show Less' : 'Show More'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Products Grid or Empty State */}
          {products.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <p className="text-gray-600">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={{
                    ...product,
                    id: product._id || product.id,
                    discountPrice: `$${product.price}`,
                    actualPrice: product.originalPrice ? `$${product.originalPrice}` : `$${product.price}`,
                    salesCount: product.stock || 0,
                    feature: product.description?.substring(0, 50) + '...' || 'No description',
                  }}
                  isDimmed={modalProductId && modalProductId !== (product._id || product.id)}
                  onQuickView={setModalProductId}
                  onClick={() => router.push(`/products/${product._id || product.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
      </div>

      {/* Quick View Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-4xl relative shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-slide-up">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-600 hover:text-white text-green-600 transition-all duration-200 z-10"
              onClick={() => setModalProductId(null)}
              aria-label="Close quick view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left: Image preview */}
            <div className="w-full h-64 md:h-full bg-gray-50 rounded-xl overflow-hidden relative border border-gray-200">
              <Image 
                src={modalProduct.image} 
                alt={modalProduct.name} 
                fill 
                className="object-contain p-4" 
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                  {modalProduct.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{modalProduct.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.5)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold text-black">
                    ${modalProduct.price}
                  </span>
                  {modalProduct.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${modalProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full mb-4">
                  <span className="text-sm text-gray-700">
                    <span className="font-bold text-black">{modalProduct.stock}</span> in stock
                  </span>
                </div>

                {/* Category & Brand */}
                <div className="flex gap-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Category:</span>
                    <p className="font-semibold text-black">{modalProduct.category}</p>
                  </div>
                  {modalProduct.brand && (
                    <div>
                      <span className="text-xs text-gray-500">Brand:</span>
                      <p className="font-semibold text-black">{modalProduct.brand}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3">
                <button 
                  onClick={() => router.push(`/products/${modalProduct._id || modalProduct.id}`)}
                  className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  View Details
                </button>
                <div className="flex items-center gap-3">
                  <button className="flex-1 px-6 py-3 border border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-200">
                    Add to Cart
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Collection;
