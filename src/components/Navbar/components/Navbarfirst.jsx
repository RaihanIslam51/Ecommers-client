"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaFire, FaTags, FaStore } from "react-icons/fa";
import { MdEmail, MdDashboard } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import SupportModal from "./SupportModal";

const Navbarfirst = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { data: session } = useSession();

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      console.log('📦 Categories Response:', response.data);
      if (response.data && response.data.categories) {
        console.log('✅ Categories loaded:', response.data.categories);
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  return (
    <>
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
      
      <div className="flex items-center justify-between w-full py-2 bg-green-50 border-b border-green-200">
        {/* Left Side - Contact Info */}
        <div className="flex items-center gap-6">
          <Link 
            href="tel:01956486761" 
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <FaPhoneAlt className="text-xs group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">+88013095 40406</span>
          </Link>

          <div className="w-px h-3 bg-green-300"></div>

          <Link 
            href="mailto:info@rannerkaj.com" 
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <MdEmail className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">info@rannerkaj.com</span>
          </Link>
        </div>

        {/* Right Side - Quick Links */}
        <div className="flex items-center gap-5">
          {/* Dashboard Link for Admin */}
           <Link 
            href="/store" 
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <IoStorefrontSharp className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Browse Store</span>
          </Link>
           <div className="w-px h-3 bg-green-300"></div>

          {/* Categories Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowCategoryDropdown(true)}
            onMouseLeave={() => setShowCategoryDropdown(false)}
          >
            <Link 
              href="/store" 
              className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
            >
              <FaTags className="text-sm group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Categories</span>
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Categories Dropdown Menu */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider">
                    All Categories ({categories.length})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category._id || category.id}
                        href={`/store?category=${encodeURIComponent(category.name)}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                        onClick={() => {
                          console.log('Category clicked:', category);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <span className="text-2xl">{category.icon || '📦'}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 group-hover:text-green-900">
                            {category.name}
                          </p>
                          <p className="text-xs text-green-500">
                            {category.productCount ?? 0} products
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-green-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-green-600">
                      Loading categories...
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <Link 
                    href="/store" 
                    className="block text-center text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            )}
          </div>

         

         

          <div className="w-px h-3 bg-green-300"></div>

          <Link 
            href="/new-arrivals" 
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <AiFillStar className="text-sm group-hover:scale-110 transition-transform text-yellow-400" />
            <span className="text-xs font-medium">New</span>
          </Link>

          <div className="w-px h-3 bg-green-300"></div>

          <Link 
            href="/hot-deals" 
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <FaFire className="text-sm group-hover:scale-110 transition-transform text-red-500 animate-pulse" />
            <span className="text-xs font-medium">Hot Deals 🔥</span>
          </Link>

          <div className="w-px h-3 bg-green-300"></div>

        
           <button 
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-200 group"
          >
            <RiCustomerService2Fill className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Customer Support</span>
          </button>
            <div className="w-px h-3 bg-green-300"></div>
           {session?.user?.role === "admin" && (
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-all duration-200 group"
              >
                <MdDashboard className="text-sm group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Dashboard</span>
              </Link>
              <div className="w-px h-3 bg-green-300"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbarfirst;
