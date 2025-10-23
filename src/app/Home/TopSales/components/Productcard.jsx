"use client";
import React from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaEye } from "react-icons/fa";

const ProductCard = ({ product, isDimmed, onQuickView }) => {
  return (
    <div
      className={`relative group rounded-md shadow-md overflow-hidden bg-white w-full h-80 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
        isDimmed ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
          {product.badge}
        </span>
      )}

      {/* Hover Icons (Slide from Right) */}
      <div className="absolute top-3 right-[-60px] flex flex-col gap-3 transition-all duration-300 group-hover:right-3 z-20">
        <button className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors">
          <FaShoppingCart className="text-gray-800 text-lg" />
        </button>
        <button className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors">
          <FaHeart className="text-red-500 text-lg" />
        </button>
        <button
          className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition-colors"
          onClick={() => onQuickView(product.id)}
        >
          <FaEye className="text-blue-500 text-lg" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-t-md transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="p-2 flex flex-col justify-between h-[calc(100%-12rem)]">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-800 text-center">
            {product.name}
          </h3>
          <p className="text-[13px] text-blue-500 text-center font-medium leading-relaxed">
            {product.feature}
          </p>
        </div>

        {/* Pricing & Sales */}
        <div>
          <div className="flex items-center gap-3 justify-center">
            <span className="text-green-600 font-bold text-lg">{product.discountPrice}</span>
            <span className="text-gray-400 line-through text-sm">{product.actualPrice}</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-yellow-500">
            <span className="text-gray-600 text-sm ml-1">({product.salesCount} sold)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
