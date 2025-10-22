"use client";
import React from "react";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

const Navbarsecond = () => {
  return (
    <div className="text-white">
      <div
        className="
          max-w-7xl mx-auto w-full 
          flex items-center justify-between 
          px-4 sm:px-6 lg:px-8 
          h-12 md:h-16
        "
      >
        {/* === LEFT: LOGO === */}
        <div className="flex items-center flex-shrink-0">
          <Link
            href="/"
            className="text-2xl sm:text-2xl md:text-3xl font-bold text-blue-600 tracking-wide"
          >
            BDMart
          </Link>
        </div>

        {/* === CENTER: SEARCH BAR === */}
        <div className="flex-1 mx-2 sm:mx-4 md:mx-6">
          <form className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="
                w-full h-10 sm:h-11 md:h-12 bg-white rounded-md
                py-2 sm:py-2.5 md:py-3 pl-3 pr-10
                focus:outline-none focus:ring-2 focus:ring-blue-500
                placeholder-gray-400 text-sm sm:text-base md:text-base
                shadow-sm
              "
            />
            <button
              type="submit"
              className="
                absolute top-1/2 right-0 -translate-y-1/2 
                text-black  
                px-3 sm:px-4 md:px-5 py-2 md:py-2.5 transition
              "
            >
              <IoMdSearch className="font-semibold text-2xl" size={20} />
            </button>
          </form>
        </div>

        {/* === RIGHT: ICONS === */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-7 text-white">
          <Link
            href="/"
            className="text-sm sm:text-base md:text-lg font-semibold"
          >
            Offters
          </Link>

          {/* Cart Icon */}
          <div className="relative">
            <Link
              href="/cart"
              className="hover:text-blue-500 transition"
              aria-label="Cart"
            >
              <FaShoppingCart size={22} />
            </Link>
            <span
              className="
                absolute -top-2 -right-2
                bg-red-600 text-white text-xs sm:text-sm font-bold
                w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center
                rounded-full
              "
            >
              3
            </span>
          </div>

          {/* Heart Icon */}
          <div className="relative">
            <Link
              href="/wishlist"
              className="hover:text-blue-500 transition"
              aria-label="Wishlist"
            >
              <FaHeart size={20} />
            </Link>
            <span
              className="
                absolute -top-2 -right-2
                bg-red-600 text-white text-xs sm:text-sm font-bold
                w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center
                rounded-full
              "
            >
              3
            </span>
          </div>

          {/* User Icon */}
          <Link
            href="/profile"
            className="hover:text-blue-600 transition"
            aria-label="User Account"
          >
            <FaUser size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbarsecond;
