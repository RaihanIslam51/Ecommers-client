"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaStore } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import SearchResults from "./SearchResults";

const Navbarsecond = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const { data: session } = useSession();
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
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
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
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
    <nav >
      <div className="flex justify-between items-center h-full py-3 md:py-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-green-600 transition-colors p-2 -ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <HiShoppingBag className="text-white text-xl md:text-2xl" />
            </div>
            
            <div className="hidden sm:flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                RannerKaj
              </span>
              <span className="text-[9px] text-green-600 font-semibold tracking-widest uppercase">
                Fresh & Healthy Foods
              </span>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 md:mx-8 lg:mx-12 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <IoMdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                placeholder="Search fresh products, meal kits..."
                className="w-full h-11 md:h-12 bg-gray-50 rounded-full pl-12 pr-4 md:pr-28 text-sm font-medium placeholder-gray-400 border-2 border-transparent focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200 font-semibold text-sm hidden md:block shadow-sm hover:shadow-md"
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
          {/* Store */}
          <div className="hidden md:block relative">
            <Link 
              href="/store" 
              className="flex items-center gap-2 px-4 py-2 text-black rounded-full hover:bg-green-50 transition-all duration-300 font-semibold text-sm transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
              title="Browse Store"
            >
              <FaStore className="text-black text-lg" />
              <span>Store Now</span>
            </Link>
          </div>

          {/* Wishlist */}
          <div className="hidden md:block relative">
            <Link 
              href="/wishlist" 
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-green-50 transition-all duration-200 group relative"
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
              className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-green-50 transition-all duration-200 group relative"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-gray-600 group-hover:text-green-600 transition-colors text-lg" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] min-w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Account with Dropdown */}
          <div className="hidden md:block relative" ref={userDropdownRef}>
            {session ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-green-50 transition-all duration-200 group"
                  title="My Account"
                >
                  <FaUser className="text-gray-600 group-hover:text-green-600 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                      {session.user?.role === "admin" && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaUser className="text-gray-400" />
                        <span>My Profile</span>
                      </Link>

                      {session.user?.role === "admin" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HiShoppingBag className="text-gray-400" />
                          <span>Dashboard</span>
                        </Link>
                      )}

                      {/* <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaShoppingCart className="text-gray-400" />
                        <span>My Orders</span>
                      </Link> */}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-green-50 transition-all duration-200 group"
                title="Sign In"
              >
                <FaUser className="text-gray-600 group-hover:text-green-600 transition-colors" />
              </Link>
            )}
          </div>
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
                className="block text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 py-3 px-4 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{link.name}</span>
                  <span className="text-gray-400">→</span>
                </span>
              </Link>
            ))}
            
            {/* User Session Links */}
            {session ? (
              <>
                {/* Profile Link */}
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-green-600 hover:bg-green-50 font-medium transition-all duration-200 py-3 px-4 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-semibold">My Profile</span>
                    <span className="text-gray-400">→</span>
                  </span>
                </Link>

                {/* Dashboard Link (Admin Only) */}
                {session.user?.role === "admin" && (
                  <Link
                    href="/dashboard"
                    className="block bg-purple-600 text-white hover:bg-purple-700 font-semibold transition-all duration-200 py-3 px-4 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-sm">Admin Dashboard</span>
                      <span>→</span>
                    </span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full block bg-red-600 text-white hover:bg-red-700 font-semibold transition-all duration-200 py-3 px-4 rounded-lg mt-4"
                >
                  <span className="flex items-center justify-between">
                    <span className="text-sm">Logout</span>
                    <span>→</span>
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="block bg-black text-white hover:bg-gray-800 font-semibold transition-all duration-200 py-3 px-4 rounded-lg mt-4"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  <span className="text-sm">Sign In</span>
                  <span>→</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbarsecond;
