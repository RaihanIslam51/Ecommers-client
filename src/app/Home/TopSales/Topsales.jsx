"use client";
import React, { useState } from "react";
import ProductCard from "./components/Productcard";
import Image from "next/image";

const Topsales = () => {
  const [modalProductId, setModalProductId] = useState(null);
  const [showAll, setShowAll] = useState(false); // For "See More / See Less"

  const dummyProducts = [
    { id: 1, name: "Wireless Headphones", feature: "Noise-cancellation and 20-hour battery life", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "High-quality wireless headphones with clear sound and comfortable fit.", actualPrice: "$79.99", discountPrice: "$49.99", salesCount: 1240 },
    { id: 2, name: "Smart Watch", feature: "Heart rate monitor and sleep tracking", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "discount", description: "Track your fitness and health metrics with style and accuracy.", actualPrice: "$149.99", discountPrice: "$99.99", salesCount: 980 },
    { id: 3, name: "Bluetooth Speaker", feature: "Waterproof design and 10-hour playtime", image:"https://i.ibb.co/twGxFqM0/watch.jpg", badge: "save", description: "Take your music anywhere with high-quality sound and durability.", actualPrice: "$49.99", discountPrice: "$29.99", salesCount: 650 },
    { id: 4, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
    { id: 5, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
    { id: 6, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
    { id: 7, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
    { id: 8, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
    { id: 9, name: "Gaming Mouse", feature: "Adjustable DPI and programmable buttons", image: "https://i.ibb.co/twGxFqM0/watch.jpg", badge: "hot", description: "Enhance your gaming experience with precision and comfort.", actualPrice: "$59.99", discountPrice: "$39.99", salesCount: 1120 },
  ];

  const modalProduct = dummyProducts.find((p) => p.id === modalProductId);

  // Slice products: show first 6 if showAll is false
  const displayedProducts = showAll ? dummyProducts : dummyProducts.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto relative py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Top Selling Products</h2>
          <p className="text-sm text-slate-500 mt-1">Best sellers handpicked from across our global marketplace.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-sm text-slate-600">Showing {displayedProducts.length} of {dummyProducts.length}</span>
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <span className="font-medium text-sm">{showAll ? 'See Less' : 'See More'}</span>
            <svg className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isDimmed={modalProductId && modalProductId !== product.id}
            onQuickView={setModalProductId}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setModalProductId(null)}
              aria-label="Close quick view"
            >
              ✕
            </button>

            {/* Left: Image preview */}
            <div className="w-full h-64 md:h-auto bg-gray-100 rounded-lg overflow-hidden relative">
              <Image src={modalProduct.image} alt={modalProduct.name} fill className="object-contain" />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{modalProduct.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{modalProduct.feature}</p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="text-green-600 font-bold text-2xl">{modalProduct.discountPrice}</div>
                  <div className="text-gray-400 line-through">{modalProduct.actualPrice}</div>
                </div>

                <div className="mt-3 text-sm text-slate-600">{modalProduct.salesCount} sold</div>

                <p className="mt-4 text-gray-700">{modalProduct.description}</p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Add to cart</button>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-md">Wishlist</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Topsales;
