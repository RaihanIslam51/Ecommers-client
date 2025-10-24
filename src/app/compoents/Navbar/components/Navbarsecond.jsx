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
    <nav className="bg-transparent text-white">
      <div className="flex justify-between items-center h-full py-2">
        {/* LEFT: Logo + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="hidden md:inline-block text-2xl md:text-3xl font-extrabold">
              <span className="text-blue-400">BD</span>
              <span className="text-indigo-400">Mart</span>
            </span>
            <span className="text-sm md:text-base text-slate-300 hidden md:block">Global Marketplace</span>
          </Link>

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 mx-16">
          <form className="relative w-full md:w-3/5 lg:w-1/2 mx-auto">
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
              className="w-full h-11 md:h-12 bg-white rounded-md pl-4 pr-12 text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg"
            />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 px-3 md:px-4 py-2 text-indigo-700 bg-indigo-100 rounded-full shadow-sm hover:bg-indigo-200 transition"
              aria-label="Search"
            >
              <IoMdSearch size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-400 text-white font-medium shadow-xl hover:from-indigo-600 hover:via-violet-600 hover:to-blue-500 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Dashboard"
            title="Dashboard"
          >
            <FaTachometerAlt className="w-4 h-4" />
            <span className="hidden md:inline-block">Dashboard</span>
          </Link>
          {/* Cart */}
          <div className="relative">
            <Link href="/cart" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
              <FaShoppingCart size={18} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              3
            </span>
          </div>

          {/* Wishlist */}
          <div className="hidden md:flex relative">
            <Link href="/wishlist" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
              <FaHeart size={16} />
            </Link>
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              3
            </span>
          </div>

          {/* User */}
          <Link href="/profile" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition text-white">
            <FaUser size={16} />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-sm px-4 py-3 space-y-2 rounded-b-lg">
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-white hover:text-indigo-300 font-medium transition py-1"
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
