"use client";
import Link from "next/link";
import React from "react";

const Navbarthrid = () => {
  return (
    <div className="w-full">
      <div className="hidden lg:flex items-center justify-center overflow-x-auto scrollbar-hide">
        <nav className="flex items-center gap-0.5 whitespace-nowrap py-2.5">
          <Link href="/" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Home
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/about" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              About
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/services" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Services
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/products" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Products
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/blog" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Blog
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/contact" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Contact
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/faq" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              FAQ
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/careers" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Careers
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/support" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              Support
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
          <Link href="/more" className="relative px-4 py-1.5 text-gray-700 hover:text-black transition-colors duration-200 text-sm font-medium group">
            <span className="relative">
              More
              <span className="absolute -bottom-2.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-200"></span>
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbarthrid;
