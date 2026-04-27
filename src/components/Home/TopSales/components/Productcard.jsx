"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaEye } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import Swal from "sweetalert2";

const ProductCard = ({ product, isDimmed, onQuickView, onClick }) => {
  const router = useRouter();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = product._id || product.id;

  const productImage = product.image || "https://via.placeholder.com/300";
  const productName = product.name || "Product Name";
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
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      setIsAddingToCart(false);
    }, 400);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } else {
      addToWishlist(product);
      Swal.fire({
        icon: "success",
        title: "Added to Wishlist!",
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  const handleBuyNow = useCallback(
    (e) => {
      e.stopPropagation();
      const productData = encodeURIComponent(JSON.stringify(product));
      router.push(`/quick-checkout?product=${productData}`);
    },
    [product, router]
  );

  return (
    <>
      <div
        onClick={onClick}
        className={`group relative flex flex-col bg-[#fafaf8] border border-[#e8e6e0] overflow-hidden cursor-pointer h-[360px] transition-all duration-400 ${isDimmed ? "opacity-35 pointer-events-none" : "hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 hover:border-[#c8c4ba]"}`}
      >
      {/* ── IMAGE ZONE ── */}
      <div className="relative flex-none h-[72%] overflow-hidden bg-[#f0ede6]">
        <Image
          src={productImage}
          alt={productName}
          fill
          className="object-cover transition-transform duration-[600ms] cubic-bezier(0.25, 0.46, 0.45, 0.94) group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.18] to-transparent opacity-0 transition-opacity duration-400 z-5 group-hover:opacity-100" />

        {/* Action icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-[7px] z-20 opacity-0 translate-x-2.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
            className={`w-[34px] h-[34px] bg-white/[0.92] backdrop-blur-[6px] border border-black/[0.08] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${isInWishlist(productId) ? "text-[#c0392b]" : "text-[#555] hover:text-[#c0392b] hover:bg-white hover:scale-110"}`}
          >
            <FaHeart style={{ fontSize: 11 }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(productId);
            }}
            title="Quick View"
            className="w-[34px] h-[34px] bg-white/[0.92] backdrop-blur-[6px] border border-black/[0.08] rounded-full flex items-center justify-center cursor-pointer text-[#555] transition-all duration-200 hover:text-[#2563eb] hover:bg-white hover:scale-110"
          >
            <FaEye style={{ fontSize: 11 }} />
          </button>
        </div>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white font-medium text-[10px] tracking-[0.08em] px-[9px] py-[3px] z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            −{discountPercent}%
          </span>
        )}

        {/* Out of stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-[#fafaf8]/75 backdrop-blur-sm flex items-center justify-center z-15">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888] border border-[#ccc] px-[14px] py-[5px] bg-white/80" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── INFO ZONE ── */}
      <div className="flex-none h-[28%] flex flex-col justify-center px-[14px] py-[10px] pb-3 gap-1.5 border-t border-[#e8e6e0] bg-[#fafaf8]">
        <p className="font-serif text-[15px] font-medium text-[#1a1a1a] whitespace-nowrap overflow-hidden text-ellipsis leading-[1.3] tracking-[0.01em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {productName}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm text-[#1a1a1a] tracking-[0.01em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ${salePrice.toFixed(2)}
          </span>
          {originalPrice > salePrice && (
            <span className="text-[11px] font-normal text-[#aaa] line-through" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-medium text-[#b94040] ml-auto tracking-[0.04em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              −{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-0.5">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAddingToCart}
            className="flex-1 py-1.5 font-medium text-[10px] tracking-[0.1em] uppercase bg-transparent text-[#1a1a1a] border border-[#1a1a1a] cursor-pointer transition-all duration-250 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:text-[#fafaf8]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {isAddingToCart ? "Adding…" : "Add to Cart"}
          </button>
          {stock > 0 && (
            <button
              onClick={handleBuyNow}
              className="flex-1 py-1.5 font-medium text-[10px] tracking-[0.1em] uppercase bg-[#1a1a1a] text-[#fafaf8] border-none cursor-pointer transition-all duration-250 hover:bg-[#333]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductCard;