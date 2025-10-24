"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaTachometerAlt } from "react-icons/fa";
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
    <nav className="bg-white text-black">
      <div className="flex justify-between items-center h-full py-3">
        {/* LEFT: Logo + Mobile Menu Button */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 md:gap-2.5 group">
            {/* Logo Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 bg-black rounded-md flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-200">
              <span className="text-white font-black text-base md:text-lg">BD</span>
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight leading-none text-black">
                BDMart
              </span>
              <span className="text-[7px] md:text-[8px] text-gray-500 font-medium tracking-wider hidden sm:block uppercase">
                Shop Everything
              </span>
            </div>
          </Link>

          <button
            className="md:hidden text-black text-lg hover:text-gray-600 transition-colors duration-200 p-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 mx-2.5 md:mx-5 lg:mx-10 max-w-lg xl:max-w-xl">
          <form className="relative w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-3.5 flex items-center pointer-events-none">
                <IoMdSearch className="text-gray-400 group-focus-within:text-black transition-colors" size={16} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-9 md:h-10 bg-gray-50 text-black rounded-md pl-9 md:pl-10 pr-2 md:pr-24 text-sm placeholder-gray-400 border border-gray-200 focus:border-black focus:bg-white focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-1 -translate-y-1/2 px-3.5 md:px-4 py-1.5 text-white bg-black hover:bg-gray-800 rounded-md transition-colors duration-200 font-semibold text-xs hidden md:block"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Action Icons */}
        <div className="flex items-center gap-1 md:gap-1.5">
          {/* Cart */}
          <div className="relative">
            <Link 
              href="/cart" 
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md hover:bg-gray-50 transition-colors duration-200 text-black"
              title="Cart"
            >
              <FaShoppingCart size={15} />
            </Link>
            <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] min-w-4 h-4 flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </div>

          {/* Wishlist */}
          <div className="hidden md:flex relative">
            <Link 
              href="/wishlist" 
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md hover:bg-gray-50 transition-colors duration-200 text-black"
              title="Wishlist"
            >
              <FaHeart size={14} />
            </Link>
            <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] min-w-4 h-4 flex items-center justify-center rounded-full font-bold">
              5
            </span>
          </div>

          {/* User Account */}
          <Link 
            href="/profile" 
            className="hidden md:flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md hover:bg-gray-50 transition-colors duration-200 text-black"
            title="Account"
          >
            <FaUser size={14} />
          </Link>

          {/* Dashboard */}
          <Link 
            href="/dashboard" 
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-xs font-semibold ml-1.5"
            title="Dashboard"
          >
            <FaTachometerAlt size={12} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-0.5 border-t border-gray-100 shadow-lg">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 hover:text-black hover:bg-gray-50 font-medium transition-all duration-200 py-2.5 px-3.5 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center justify-between">
                <span className="text-sm">{link.name}</span>
                <span className="text-gray-400 text-xs">→</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbarsecond;
