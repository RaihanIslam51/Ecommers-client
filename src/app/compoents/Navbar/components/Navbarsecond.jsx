"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

const Navbarsecond = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Careers", href: "/careers" },
    { name: "Support", href: "/support" },
    { name: "More", href: "/more" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* LEFT: Logo + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden md:block text-2xl md:text-3xl font-bold text-blue-500 tracking-wide"
            >
              BDMart
            </Link>
            <button
              className="md:hidden text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 mx-4">
            <form className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full h-10 md:h-12 bg-white rounded-md pl-3 pr-10 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-0 -translate-y-1/2 px-3 md:px-4 py-2 text-black"
              >
                <IoMdSearch size={20} />
              </button>
            </form>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Cart */}
            <div className="relative">
              <Link href="/cart" className="hover:text-blue-500 transition">
                <FaShoppingCart size={22} />
              </Link>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            {/* Wishlist */}
            <div className=" hidden md:flex relative">
              <Link href="/wishlist" className="hover:text-blue-500 transition">
                <FaHeart size={20} />
              </Link>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full">
                3
              </span>
            </div>

            {/* User */}
            <Link href="/profile" className="hidden md:flex hover:text-blue-500 transition">
              <FaUser size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-white hover:text-blue-500 font-medium transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbarsecond;
