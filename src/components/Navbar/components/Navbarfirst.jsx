"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { FaPhoneAlt, FaFire, FaTags, FaStore } from "react-icons/fa";
import { MdEmail, MdDashboard } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import SupportModal from "./SupportModal";

const Navbarfirst = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const hideTimeoutRef = React.useRef(null);
  const { data: session } = useSession();

  const handleCategoryEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowCategoryDropdown(true);
  };

  const handleCategoryLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowCategoryDropdown(false), 150);
  };

  useEffect(() => {
    axiosInstance.get('/categories')
      .then(res => {
        const data = res.data;
        // handle both { categories: [...] } and [...]
        setCategories(Array.isArray(data) ? data : (data.categories || []));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <div className="flex items-center justify-between w-full h-9">
        {/* Left — Contact */}
        <div className="flex items-center gap-5">
          <Link
            href="tel:01956486761"
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200 group"
          >
            <FaPhoneAlt className="text-[10px] text-gray-700" />
            <span className="text-[11px] font-medium tracking-wide text-black">+880 1309 540406</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="mailto:info@BDmart.com"
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
          >
            <MdEmail className="text-xs text-gray-700" />
            <span className="text-[11px] font-medium tracking-wide text-black">info@BDmart.com</span>
          </Link>
        </div>

        {/* Right — Quick links */}
        <div className="flex items-center gap-5">
          <Link
            href="/store"
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
          >
            <IoStorefrontSharp className="text-xs text-gray-700" />
            <span className="text-[11px] font-medium text-black">Browse Store</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <Link
              href="/store"
              className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
            >
              <FaTags className="text-[10px] text-gray-700" />
              <span className="text-[11px] font-medium text-black">Categories</span>
              <svg
                className={`w-2.5 h-2.5 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 w-60 z-50" style={{ paddingTop: '6px' }}>
                <div className="bg-white border border-gray-100 rounded-lg shadow-xl py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">All Categories</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat._id || cat.id}
                          href={`/store?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                          onClick={() => setShowCategoryDropdown(false)}
                        >
                          <span className="text-xl text-gray-700">{cat.icon || "📦"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black group-hover:text-gray-700 truncate">
                              {cat.name}
                            </p>
                            <p className="text-[11px] text-black">{cat.productCount ?? 0} products</p>
                          </div>
                          <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-[11px] text-black">No categories found</div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link
                      href="/store"
                      className="block text-center text-[11px] font-semibold text-black hover:text-gray-700 transition-colors"
                    >
                      View all →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="/new-arrivals"
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
          >
            <AiFillStar className="text-[10px] text-gray-700" />
            <span className="text-[11px] font-medium text-black">New Arrivals</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="/hot-deals"
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
          >
            <FaFire className="text-[10px] text-gray-700" />
            <span className="text-[11px] font-medium text-black">Hot Deals</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
          >
            <RiCustomerService2Fill className="text-xs text-gray-700" />
            <span className="text-[11px] font-medium text-black">Support</span>
          </button>

          {session?.user?.role === "admin" && (
            <>
              <span className="w-px h-3 bg-gray-200" />
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-black hover:text-gray-700 transition-colors duration-200"
              >
                <MdDashboard className="text-xs text-gray-700" />
                <span className="text-[11px] font-medium text-black">Dashboard</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbarfirst;
