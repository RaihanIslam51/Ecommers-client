"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaHome, FaStore, FaTags, FaFire, FaEnvelope } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";

const Navbarthrid = () => {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);

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
  
  const navLinks = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "New Arrivals", href: "/new-arrivals", icon: HiSparkles, badge: "New" },
    { name: "Store", href: "/store", icon: FaStore },
    { name: "Hot Deals", href: "/deals", icon: FaFire, badge: "Hot" },
    { name: "Categories", href: "/categories", icon: FaTags, hasDropdown: true },
    { name: "Contact Us", href: "/contact", icon: FaEnvelope },
  ];

  // Add Dashboard link if user is admin
  const displayLinks = session?.user?.role === "admin" 
    ? [
        { name: "Dashboard", href: "/dashboard", icon: MdDashboard, badge: "Admin", isAdmin: true },
        ...navLinks
      ]
    : navLinks;

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-center">
        <nav className="flex items-center gap-1">
          {displayLinks.map((link) => {
            const Icon = link.icon;
            
            // Categories with dropdown
            if (link.hasDropdown) {
              return (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setShowCategoryDropdown(true)}
                  onMouseLeave={() => setShowCategoryDropdown(false)}
                >
                  <Link 
                    href={link.href} 
                    className={`relative px-5 py-2.5 transition-all duration-200 font-medium text-sm group rounded-lg text-gray-700 hover:text-black hover:bg-gray-50`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="text-sm group-hover:scale-110 transition-transform" />
                      <span>{link.name}</span>
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-3/4"></span>
                  </Link>

                  {/* Dropdown Menu */}
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          All Categories ({categories.length})
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <Link
                              key={category._id || category.id}
                              href={`/store?category=${category.name}`}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                              onClick={() => console.log('Category clicked:', category)}
                            >
                              <span className="text-2xl">{category.icon || '📦'}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 group-hover:text-black">
                                  {category.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {category.productCount ?? 0} products
                                </p>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            Loading categories...
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link 
                          href="/categories" 
                          className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Regular links
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative px-5 py-2.5 transition-all duration-200 font-medium text-sm group rounded-lg ${
                  link.isAdmin 
                    ? "text-purple-700 hover:text-purple-900 hover:bg-purple-50" 
                    : "text-gray-700 hover:text-black hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="text-sm group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      link.badge === "Admin" 
                        ? "bg-purple-100 text-purple-700" 
                        : link.badge === "New" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 ${
                  link.isAdmin ? "bg-purple-600 group-hover:w-3/4" : "bg-black group-hover:w-3/4"
                }`}></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navbarthrid;
