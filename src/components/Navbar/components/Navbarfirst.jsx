"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaFire, FaStore } from "react-icons/fa";
import { MdEmail, MdDashboard } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import SupportModal from "./SupportModal";

const Navbarfirst = () => {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <div className="flex items-center justify-between w-full h-9 bg-white">

        {/* Left — Contact */}
        <div className="flex items-center gap-5">
          <Link
            href="tel:01956486761"
            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors duration-200"
          >
            <FaPhoneAlt className="text-[10px] text-gray-600" />
            <span className="text-[11px] font-light tracking-wide text-gray-700">+880 1309 540406</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="mailto:info@BDmart.com"
            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors duration-200"
          >
            <MdEmail className="text-xs text-gray-600" />
            <span className="text-[11px] font-light tracking-wide text-gray-700">info@BDmart.com</span>
          </Link>
        </div>

        {/* Right — Quick links */}
        <div className="flex items-center gap-5">

          <Link
            href="/store"
            className="flex items-center gap-1.5 hover:text-black transition-colors duration-200"
          >
            <FaStore className="text-xs text-gray-600" />
            <span className="text-[11px] font-light text-gray-700">Browse Store</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="/new-arrivals"
            className="flex items-center gap-1.5 hover:text-black transition-colors duration-200"
          >
            <AiFillStar className="text-[10px] text-gray-600" />
            <span className="text-[11px] font-light text-gray-700">New Arrivals</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            href="/hot-deals"
            className="flex items-center gap-1.5 hover:text-black transition-colors duration-200"
          >
            <FaFire className="text-[10px] text-gray-600" />
            <span className="text-[11px] font-light text-gray-700">Hot Deals</span>
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-black transition-colors duration-200"
          >
            <RiCustomerService2Fill className="text-xs text-gray-600" />
            <span className="text-[11px] font-light text-gray-700">Support</span>
          </button>

          {session?.user?.role === "admin" && (
            <>
              <span className="w-px h-3 bg-gray-200" />
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 hover:text-black transition-colors duration-200"
              >
                <MdDashboard className="text-xs text-gray-600" />
                <span className="text-[11px] font-light text-gray-700">Dashboard</span>
              </Link>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Navbarfirst;