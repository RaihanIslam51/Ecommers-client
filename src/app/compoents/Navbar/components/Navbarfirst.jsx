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
    <div className="w-full bg-gray-900 text-gray-200 text-sm">
      <div
        className="
          flex flex-wrap items-center justify-center gap-x-6 gap-y-2 
          py-2 px-4 
          text-center
        "
      >
        {/* Phone */}
        <Link
          href="tel:01956486761"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <FaPhoneAlt className="text-blue-400" />
          +8801956-486761
        </Link>

        {/* Email */}
        <Link
          href="mailto:info@bdmart.com"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <MdEmail className="text-yellow-400" />
          info@bdmart.com
        </Link>

        {/* Customer Service */}
        <Link
          href="/customer-service"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <RiCustomerService2Fill className="text-green-400" />
          Customer Service
        </Link>

        {/* New Arrival */}
        <Link
          href="/new-arrivals"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <AiFillStar className="text-orange-400" />
          New Arrival
        </Link>

        {/* Store */}
        <Link
          href="/store"
          className="flex items-center gap-2 hover:text-white transition"
        >
          <IoStorefrontSharp className="text-pink-400" />
          Store
        </Link>
      </div>
    </div>
  );
};

export default Navbarfirst;
