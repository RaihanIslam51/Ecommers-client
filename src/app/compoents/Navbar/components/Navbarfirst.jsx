"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import SupportModal from "./SupportModal";

const Navbarfirst = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  return (
    <>
      {/* Support Modal */}
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    <div className="hidden lg:flex items-center justify-center w-full text-white">
      <div className="flex items-center justify-between w-full py-1.5">
        {/* Left Side - Contact Info */}
        <div className="flex items-center gap-5 xl:gap-6">
          {/* Phone */}
          <Link 
            href="tel:01956486761" 
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaPhoneAlt size={10} />
            <span className="text-xs">+880 1956-486761</span>
          </Link>

          {/* Separator */}
          <span className="text-gray-800">|</span>

          {/* Email */}
          <Link 
            href="mailto:info@bdmart.com" 
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <MdEmail size={11} />
            <span className="text-xs">info@bdmart.com</span>
          </Link>
        </div>

        {/* Right Side - Quick Links */}
        <div className="flex items-center gap-4 xl:gap-5">
          {/* Customer Support - Opens Modal */}
          <button 
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <RiCustomerService2Fill size={11} />
            <span className="text-xs">Support</span>
          </button>

          {/* Separator */}
          <span className="text-gray-800">|</span>

          {/* New Arrival */}
          <Link 
            href="/new-arrivals" 
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <AiFillStar size={11} />
            <span className="text-xs">New</span>
          </Link>

          {/* Separator */}
          <span className="text-gray-800">|</span>

          {/* Store */}
          <Link 
            href="/store" 
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <IoStorefrontSharp size={11} />
            <span className="text-xs">Store</span>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Navbarfirst;
