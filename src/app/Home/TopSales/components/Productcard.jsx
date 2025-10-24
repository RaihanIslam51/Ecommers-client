"use client";
import React from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaEye } from "react-icons/fa";

const ProductCard = ({ product, isDimmed, onQuickView }) => {
  return (
    <article
      className={`relative group rounded-lg overflow-hidden bg-white w-full h-80 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent focus-within:ring-2 focus-within:ring-blue-200 ${
        isDimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
      tabIndex={0}
      aria-labelledby={`product-${product.id}-name`}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg">
          {product.badge}
        </span>
      )}

    {/* Action icons: hidden on mobile, show on tap (focus) or hover; desktop keeps slide-in on hover */}
  <div className="absolute top-3 right-3 md:-right-16 flex flex-col gap-3 transition-all duration-300 z-30 opacity-0 translate-x-2
      group-hover:opacity-100 group-hover:translate-x-0 group-focus:opacity-100 group-focus:translate-x-0 md:group-hover:right-3 md:group-hover:opacity-100 md:translate-x-0">
        <button className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors" aria-label="Add to cart">
          <FaShoppingCart className="text-gray-800 text-lg" />
        </button>
        <button className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors" aria-label="Add to wishlist">
          <FaHeart className="text-red-500 text-lg" />
        </button>
        <button
          className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors"
          onClick={() => onQuickView(product.id)}
          aria-label="Quick view"
        >
          <FaEye className="text-blue-600 text-lg" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* subtle overlay on hover for CTA */}
  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col justify-between h-[calc(100%-12rem)]">
        <div className="text-center">
          <h3 id={`product-${product.id}-name`} className="text-sm md:text-base font-semibold text-slate-800 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-sky-600 font-medium mt-1 truncate">{product.feature}</p>
        </div>

        {/* Pricing & Sales */}
        <div className="mt-3">
          <div className="flex items-center justify-center gap-3">
            <div className="text-green-600 font-extrabold text-lg md:text-xl">{product.discountPrice}</div>
            <div className="text-gray-400 line-through text-sm">{product.actualPrice}</div>
          </div>
          <div className="flex items-center justify-center text-sm text-slate-600 mt-2">
            <span className="mr-1">{product.salesCount}</span>
            <span className="text-gray-400">sold</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
