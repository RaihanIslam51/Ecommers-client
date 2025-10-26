"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import SearchResults from "./SearchResults";

const Navbarsecond = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const searchRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to store page with search query
      window.location.href = `/store?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length >= 2);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const mobileMenuLinks = [
    { name: "Home", href: "/" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Store", href: "/store" },
    { name: "Categories", href: "/categories" },
    { name: "Deals", href: "/deals" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white">
      <div className="flex justify-between items-center h-full py-3 md:py-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-black transition-colors p-2 -ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <HiShoppingBag className="text-white text-xl md:text-2xl" />
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                BDMart
              </span>
              <span className="text-[9px] text-gray-500 font-semibold tracking-widest uppercase">
                Your Wholesale Partner
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 md:mx-8 lg:mx-12 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <IoMdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                placeholder="Search products, categories, brands..."
                className="w-full h-11 md:h-12 bg-gray-50 rounded-full pl-12 pr-4 md:pr-28 text-sm font-medium placeholder-gray-400 border-2 border-transparent focus:border-black focus:bg-white focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-semibold text-sm hidden md:block shadow-sm hover:shadow-md"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <SearchResults query={searchQuery} onClose={closeSearchResults} />
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <div className="hidden md:block relative">
            <Link 
              href="/wishlist" 
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-all duration-200 group relative"
              title="Wishlist"
            >
              <FaHeart className="text-gray-600 group-hover:text-red-500 transition-colors text-lg" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          {/* Cart */}
          <div className="relative">
            <Link 
              href="/cart" 
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-all duration-200 group relative"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-gray-600 group-hover:text-black transition-colors text-lg" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Account */}
          <Link 
            href="/profile" 
            className="hidden md:flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-all duration-200 group"
            title="My Account"
          >
            <FaUser className="text-gray-600 group-hover:text-black transition-colors" />
          </Link>

          {/* Dashboard Button */}
          <Link 
            href="/dashboard" 
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-semibold text-sm ml-2 shadow-md hover:shadow-lg"
          >
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {mobileMenuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-black hover:bg-gray-50 font-medium transition-all duration-200 py-3 px-4 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{link.name}</span>
                  <span className="text-gray-400">→</span>
                </span>
              </Link>
            ))}
            
            {/* Mobile Dashboard Link */}
            <Link
              href="/dashboard"
              className="block bg-black text-white hover:bg-gray-800 font-semibold transition-all duration-200 py-3 px-4 rounded-lg mt-4"
              onClick={() => setMenuOpen(false)}
            >
              <span className="flex items-center justify-between">
                <span className="text-sm">Dashboard</span>
                <span>→</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbarsecond;
