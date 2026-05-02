"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaTags,
  FaChevronRight,
} from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { BiMenuAltLeft } from "react-icons/bi";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { HiShoppingBag } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useCart } from "@/context/CartContext";
import { useCategories } from "@/context/DataCacheContext";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";

const SearchResults = dynamic(() => import("./SearchResults"), {
  loading: () => null,
  ssr: false,
});

const Navbarsecond = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // activeCategoryId is now used for BOTH desktop accordion & mobile accordion
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const { cartCount, wishlistCount } = useCart();
  const { data: session } = useSession();
  const { data: categoriesData } = useCategories();
  const rawCategories = categoriesData || [];

  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
  const desktopCategoryRef = useRef(null);
  const mobileCategoryRef = useRef(null);
  const searchTimeoutRef = useRef(null);
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
      if (
        desktopCategoryRef.current &&
        !desktopCategoryRef.current.contains(e.target) &&
        (mobileCategoryRef.current
          ? !mobileCategoryRef.current.contains(e.target)
          : true)
      ) {
        setShowCategoryDropdown(false);
        setActiveCategoryId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const categoryTree = useMemo(() => {
    if (!rawCategories.length) return [];
    if (typeof rawCategories[0] === "string") {
      return rawCategories.map((name, i) => ({ id: i, name, subcategories: [] }));
    }
    return rawCategories.map((cat) => ({
      id: cat._id || cat.id || cat.name,
      name: typeof cat.name === "object" && cat.name?.name ? cat.name.name : cat.name,
      subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
    }));
  }, [rawCategories]);

  // ── Navigate helpers ────────────────────────────────────────────────────
  const navigateToCategory = useCallback((catName) => {
    setShowCategoryDropdown(false);
    setActiveCategoryId(null);
    window.location.href = `/store?category=${encodeURIComponent(catName)}`;
  }, []);

  const navigateToSubcategory = useCallback((catName, subName) => {
    setShowCategoryDropdown(false);
    setActiveCategoryId(null);
    window.location.href = `/store?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(subName)}`;
  }, []);

  // ── Toggle accordion (shared for desktop & mobile) ──────────────────────
  const toggleCategory = useCallback((catId, hasSubcategories) => {
    if (!hasSubcategories) return;
    setActiveCategoryId((prev) => (prev === catId ? null : catId));
  }, []);

  // ── Search ───────────────────────────────────────────────────────────────
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        window.location.href = `/store?search=${encodeURIComponent(searchQuery)}`;
      }
    },
    [searchQuery]
  );

  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => setShowSearchResults(true), 150);
    } else {
      setShowSearchResults(false);
    }
  }, []);

  const closeSearchResults = useCallback(() => {
    setShowSearchResults(false);
    setSearchQuery("");
  }, []);

  const mobileMenuLinks = [
    { name: "Home", href: "/" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Store", href: "/store" },
    { name: "Hot Deals", href: "/hot-deals" },
    { name: "Contact", href: "/contact" },
  ];

  // ── Shared Accordion Category List (used in both desktop dropdown & mobile menu) ──
  const AccordionCategoryList = ({ onNavigate, compact = false }) => (
    <>
      {categoryTree.length > 0 ? (
        categoryTree.map((cat) => (
          <div key={cat.id}>
            {/* Category row */}
            <button
              type="button"
              onClick={() => {
                if (cat.subcategories.length === 0) {
                  if (onNavigate) onNavigate();
                  navigateToCategory(cat.name);
                } else {
                  toggleCategory(cat.id, true);
                }
              }}
              className={`w-full flex items-center justify-between text-left border-b border-gray-100 last:border-b-0 group transition-colors duration-150 ${
                compact ? "px-2.5 py-2" : "px-4 py-3"
              } ${
                activeCategoryId === cat.id ? "bg-blue-50" : "hover:bg-blue-50"
              }`}
            >
              <span
                className={`flex-1 font-medium transition-colors ${
                  compact ? "text-[11px]" : "text-[13px]"
                } ${
                  activeCategoryId === cat.id
                    ? "text-blue-600"
                    : "text-gray-800 group-hover:text-blue-600"
                }`}
              >
                {cat.name}
                {cat.subcategories.length > 0 && (
                  <span
                    className={`ml-1.5 font-normal ${
                      compact ? "text-[9px]" : "text-[11px]"
                    } ${
                      activeCategoryId === cat.id ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    ({cat.subcategories.length})
                  </span>
                )}
              </span>
              {cat.subcategories.length > 0 && (
                <FaChevronRight
                  className={`shrink-0 transition-transform duration-200 ${
                    compact ? "text-[8px] ml-1" : "text-[10px] ml-2"
                  } ${
                    activeCategoryId === cat.id
                      ? "text-blue-500 rotate-90"
                      : "text-gray-400 group-hover:text-blue-400"
                  }`}
                />
              )}
            </button>

            {/* Accordion subcategories */}
            {activeCategoryId === cat.id && cat.subcategories.length > 0 && (
              <div
                className={`border-b border-gray-100 bg-gray-50 ${
                  compact ? "pl-3" : "pl-4"
                }`}
              >
                {/* "All <Category>" link */}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) onNavigate();
                    navigateToCategory(cat.name);
                  }}
                  className={`flex items-center w-full text-left font-bold uppercase tracking-wide text-blue-600 hover:bg-blue-100 border-b border-gray-200 transition-colors ${
                    compact ? "px-2 py-2 text-[10px]" : "px-3 py-2.5 text-[11px]"
                  }`}
                >
                  All {cat.name}
                </button>

                {/* Subcategory items */}
                {cat.subcategories.map((sub, idx) => {
                  const subName =
                    typeof sub === "object" && sub?.name ? sub.name : sub;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (onNavigate) onNavigate();
                        navigateToSubcategory(cat.name, subName);
                      }}
                      className={`flex items-center w-full text-left text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                        compact ? "px-2 py-2 text-[11px]" : "px-3 py-2.5 text-[12px]"
                      }`}
                    >
                      <span
                        className={`rounded-full bg-gray-300 mr-2 shrink-0 ${
                          compact ? "w-1 h-1" : "w-1.5 h-1.5"
                        }`}
                      />
                      {subName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <div
          className={`text-center text-gray-500 ${
            compact ? "px-3 py-4 text-[11px]" : "px-4 py-6 text-[12px]"
          }`}
        >
          No categories found
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white">
      <div className="flex items-center justify-between w-full h-full gap-2 md:gap-4 md:px-4">

        {/* ── Left: Logo + Category ── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-1.5 -ml-1"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2 sm:gap-2.5 group">
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xl sm:text-2xl md:text-[27px] font-black tracking-tight text-black">
                BDmart
              </span>
            </div>
          </Link>

          {/* ── Mobile Category Icon ── */}
          <div className="md:hidden relative" ref={mobileCategoryRef}>
            {showCategoryDropdown && (
              <div
                className="absolute left-0 z-50 mt-1 shadow-2xl rounded-lg border border-gray-200 bg-white overflow-hidden"
                style={{ width: "200px" }}
              >
                <div className="max-h-80 overflow-y-auto">
                  <AccordionCategoryList
                    compact
                    onNavigate={() => setShowCategoryDropdown(false)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Desktop Categories Button ── */}
          <div className="hidden md:block relative" ref={desktopCategoryRef}>
            <button
              onClick={() => {
                setShowCategoryDropdown((prev) => !prev);
                setActiveCategoryId(null);
              }}
              className="flex items-center gap-1.5 h-9 px-3.5 text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-semibold"
            >
              <BiMenuAltLeft className="text-lg" />
              <span>Categories</span>
            </button>

            {showCategoryDropdown && (
              <div className="absolute left-0 z-50 mt-1 shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden w-72">
                <div className="max-h-[28rem] overflow-y-auto">
                  <AccordionCategoryList
                    onNavigate={() => setShowCategoryDropdown(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="flex-1 max-w-md lg:max-w-2xl mt-2 relative" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <div className="relative flex w-full items-center border border-black rounded-full overflow-hidden bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-black/10">
                <IoMdSearch className="absolute left-3 md:left-4 text-black text-base md:text-lg pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() =>
                    searchQuery.trim().length >= 2 && setShowSearchResults(true)
                  }
                  placeholder="Search…"
                  className="w-full h-10 md:h-11 bg-white pl-9 md:pl-11 pr-2 md:pr-28 text-xs md:text-sm text-black placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 md:h-11 px-4 md:px-6 bg-black text-white text-[10px] md:text-xs font-semibold tracking-wide hover:bg-gray-900 transition-colors duration-200 hidden md:flex items-center gap-1.5 rounded-r-full"
                >
                  <IoMdSearch className="text-base" />
                  <span>Search</span>
                </button>
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center md:hidden"
                >
                  <IoMdSearch className="text-xs" />
                </button>
              </div>
            </div>
          </form>

          {showSearchResults && (
            <SearchResults query={searchQuery} onClose={closeSearchResults} />
          )}
        </div>

        {/* ── Actions Right ── */}
        <div className="flex text-black items-center gap-0.5 md:gap-1 shrink-0">
          <div className="hidden lg:block">
            <Link
              href="/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-black hover:bg-gray-100 transition-all duration-200"
              title="Wishlist"
            >
              <FaHeart className="text-[17px]" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] min-w-4 h-4 flex items-center justify-center rounded-full font-bold px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg text-black hover:bg-gray-100 transition-all duration-200"
              title="Cart"
            >
              <FaShoppingCart className="text-[17px]" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] min-w-4 h-4 flex items-center justify-center rounded-full font-bold px-0.5">
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
                  className="flex items-center gap-2 h-10 px-3 rounded-lg text-black hover:bg-gray-100 transition-all duration-200"
                  title="My Account"
                >
                  <div className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <svg
                    className={`w-3 h-3 text-black transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
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
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                      >
                        <FaUser className="text-black text-xs" />
                        <span>My Profile</span>
                      </Link>
                      {session.user?.role === "admin" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                        >
                          <MdDashboard className="text-black text-sm" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                    </div>
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
                className="flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-lg hover:bg-gray-100 text-black transition-colors duration-200"
              >
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

            {/* Mobile Categories accordion */}
            <div className="border-t border-gray-100 pt-2 pb-1">
              <p className="px-3 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Categories
              </p>
              {categoryTree.map((cat) => (
                <div key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (cat.subcategories.length === 0) {
                        setMenuOpen(false);
                        window.location.href = `/store?category=${encodeURIComponent(cat.name)}`;
                      } else {
                        toggleCategory(cat.id, true);
                      }
                    }}
                    className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <FaChevronRight
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        activeCategoryId === cat.id && cat.subcategories.length > 0
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  </button>

                  {activeCategoryId === cat.id && cat.subcategories.length > 0 && (
                    <div className="ml-4 mb-1 border-l-2 border-blue-100 pl-3 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          window.location.href = `/store?category=${encodeURIComponent(cat.name)}`;
                        }}
                        className="flex items-center w-full py-2 px-2 rounded-md text-[12px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors text-left"
                      >
                        All {cat.name}
                      </button>
                      {cat.subcategories.map((sub, idx) => {
                        const subName = typeof sub === "object" && sub?.name ? sub.name : sub;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              window.location.href = `/store?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(subName)}`;
                            }}
                            className="flex items-center w-full py-2 px-2 rounded-md text-[12px] text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-left"
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-300 mr-2 shrink-0" />
                            {subName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 my-2" />

            {session ? (
              <>
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
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
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