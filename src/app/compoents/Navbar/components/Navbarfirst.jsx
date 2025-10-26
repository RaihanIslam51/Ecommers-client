"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaFire } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import SupportModal from "./SupportModal";

const Navbarfirst = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <>
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
      
      <div className="flex items-center justify-between w-full py-2">
        {/* Left Side - Contact Info */}
        <div className="flex items-center gap-6">
          <Link 
            href="tel:01956486761" 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <FaPhoneAlt className="text-xs group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">+880 1956-486761</span>
          </Link>

          <div className="w-px h-3 bg-gray-700"></div>

          <Link 
            href="mailto:info@bdmart.com" 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <MdEmail className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">info@bdmart.com</span>
          </Link>
        </div>

        {/* Right Side - Quick Links */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <RiCustomerService2Fill className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Customer Support</span>
          </button>

          <div className="w-px h-3 bg-gray-700"></div>

          <Link 
            href="/new-arrivals" 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <AiFillStar className="text-sm group-hover:scale-110 transition-transform text-yellow-400" />
            <span className="text-xs font-medium">New Arrivals</span>
          </Link>

          <div className="w-px h-3 bg-gray-700"></div>

          <Link 
            href="/hot-deals" 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <FaFire className="text-sm group-hover:scale-110 transition-transform text-red-500 animate-pulse" />
            <span className="text-xs font-medium">Hot Deals 🔥</span>
          </Link>

          <div className="w-px h-3 bg-gray-700"></div>

          <Link 
            href="/store" 
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 group"
          >
            <IoStorefrontSharp className="text-sm group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Browse Store</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbarfirst;
