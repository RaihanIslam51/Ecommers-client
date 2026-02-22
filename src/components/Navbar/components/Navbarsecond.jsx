"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaStore,
} from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
    setSearchQuery("");
  };

  const mobileMenuLinks = [
    { name: "Home", href: "/" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Store", href: "/store" },
    { name: "Hot Deals", href: "/hot-deals" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav>
      <div className="flex items-center justify-between h-full gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-1.5 -ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <HiShoppingBag className="text-white text-lg" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[17px] font-black tracking-tight text-black">
                BDmart
              </span>
              <span className="text-[9px] text-black font-semibold tracking-widest uppercase mt-0.5">
                Fresh &amp; Healthy Foods
              </span>
            </div>
          </Link>
        </div>

        {/* ── Search ── */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <IoMdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black group-focus-within:text-black transition-colors text-lg pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                placeholder="Search products…"
                className="w-full h-10 md:h-11 bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 md:pr-24 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 bg-black text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors duration-200 hidden md:block"
              >
                Search
              </button>
            </div>
          </form>

          {showSearchResults && (
            <SearchResults query={searchQuery} onClose={closeSearchResults} />
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex text-black items-center gap-1">

          {/* Store — desktop */}
          <div className="hidden md:block">
            <Link
              href="/store"
              className="flex items-center gap-1.5 h-9 px-3.5 text-black hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-semibold"
            >
              <FaStore className="text-base" />
              <span>Store</span>
            </Link>
          </div>

          {/* Wishlist — desktop */}
          <div className="hidden md:block">
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-black hover:text-black hover:bg-gray-100 transition-all duration-200"
              title="Wishlist"
            >
              <FaHeart className="text-[17px]" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          {/* Cart */}
          <div className="relative">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-black hover:text-black hover:bg-gray-100 transition-all duration-200"
              title="Cart"
            >
              <FaShoppingCart className="text-[17px]" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User — desktop */}
          <div className="hidden md:block relative" ref={userDropdownRef}>
            {session ? (
              <>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-3 rounded-lg text-black hover:text-black hover:bg-gray-100 transition-all duration-200"
                  title="My Account"
                >
                  {/* Avatar initial */}
                  <div className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <svg className={`w-3 h-3 text-black transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
                    {/* User info */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-black truncate">
                        {session.user?.name || "User"}
                      </p>
                      <p className="text-[11px] text-black truncate mt-0.5">
                        {session.user?.email}
                      </p>
                      {session.user?.role === "admin" && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-semibold rounded-full">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        <FaUser className="text-black text-xs" />
                        <span>My Profile</span>
                      </Link>

                      {session.user?.role === "admin" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:text-black hover:bg-gray-50 transition-colors"
                        >
                          <MdDashboard className="text-black text-sm" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-lg hover:bg-white hover:text-black duration-200"
              >
                <FaUser className="text-xs" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-0.5">
            {mobileMenuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:text-black hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span>{link.name}</span>
                <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {session ? (
              <>
                {/* User info */}
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-black">{session.user?.name}</p>
                  <p className="text-xs text-black">{session.user?.email}</p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:text-black hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>My Profile</span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:text-black hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Wishlist</span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {session.user?.role === "admin" && (
                  <Link
                      href="/dashboard"
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                    <span>Admin Dashboard</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}

                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-black hover:bg-red-50 transition-colors mt-1"
                >
                  <span>Logout</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-white">Sign In</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbarsecond;
