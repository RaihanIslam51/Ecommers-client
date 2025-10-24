"use client";
import React from "react";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { AiFillStar } from "react-icons/ai";
import { IoStorefrontSharp } from "react-icons/io5";

const Navbarfirst = () => {
  return (
    <div className="hidden md:flex items-center justify-center w-full text-gray-200 text-sm">
      <div className="flex items-center justify-center w-full max-w-7xl mx-auto gap-6 py-2 px-2 text-center">
        {/* Phone */}
        <Link href="tel:01956486761" className="flex items-center gap-2 hover:text-white transition">
          <FaPhoneAlt className="text-sky-400" />
          <span className="opacity-90">+8801956-486761</span>
        </Link>

        {/* Email */}
        <Link href="mailto:info@bdmart.com" className="flex items-center gap-2 hover:text-white transition">
          <MdEmail className="text-amber-400" />
          <span className="opacity-90">info@bdmart.com</span>
        </Link>

        {/* Customer Service */}
        <Link href="/customer-service" className="flex items-center gap-2 hover:text-white transition">
          <RiCustomerService2Fill className="text-emerald-400" />
          <span className="opacity-90">Customer Service</span>
        </Link>

        {/* New Arrival */}
        <Link href="/new-arrivals" className="flex items-center gap-2 hover:text-white transition">
          <AiFillStar className="text-amber-500" />
          <span className="opacity-90">New Arrival</span>
        </Link>

        {/* Store */}
        <Link href="/store" className="flex items-center gap-2 hover:text-white transition">
          <IoStorefrontSharp className="text-rose-400" />
          <span className="opacity-90">Store</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbarfirst;
