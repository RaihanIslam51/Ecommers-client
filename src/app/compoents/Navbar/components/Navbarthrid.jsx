"use client";
import Link from "next/link";
import React from "react";

const Navbarthrid = () => {
  return (
    <div className="w-full text-white">
      {/* Hidden on small screens, horizontal scrollable nav on medium+ */}
      <div className="hidden md:flex items-center overflow-x-auto no-scrollbar gap-6 text-[15px] font-semibold py-2">
        <nav className="flex items-center gap-6 whitespace-nowrap mx-2">
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Home</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">About</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Services</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Products</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Blog</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Contact</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">FAQ</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Careers</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">Support</Link>
          <Link href="#" className="hover:text-indigo-300 transition-all tracking-wide uppercase">More</Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbarthrid;
