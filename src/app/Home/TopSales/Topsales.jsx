"use client";
import React, { useState } from "react";
import ProductCard from "./components/Productcard";

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
    <div className="max-w-7xl mx-auto relative py-6">
      {/* Title and Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold bg-blue-600 text-white px-5 py-1 rounded-md shadow">Top Sales Products</h2>
        <button
          className="text-blue-600 font-medium hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "See Less" : "See More"}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative shadow-lg animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setModalProductId(null)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{modalProduct.name}</h2>
            <p className="mb-2 text-gray-700">{modalProduct.feature}</p>
            <div className="mb-2">
              <span className="text-green-600 font-bold text-lg">{modalProduct.discountPrice}</span>{" "}
              <span className="text-gray-400 line-through text-sm">{modalProduct.actualPrice}</span>
            </div>
            <div className="text-gray-600 text-sm">{modalProduct.salesCount} sold</div>
            <p className="mt-2 text-gray-700">{modalProduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topsales;
