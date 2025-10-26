"use client";
import Link from "next/link";
import React from "react";
import { FaHome, FaStore, FaTags, FaFire, FaEnvelope } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const Navbarthrid = () => {
  const navLinks = [
    { name: "Home", href: "/", icon: FaHome },
    { name: "New Arrivals", href: "/new-arrivals", icon: HiSparkles, badge: "New" },
    { name: "Store", href: "/store", icon: FaStore },
    { name: "Hot Deals", href: "/deals", icon: FaFire, badge: "Hot" },
    { name: "Categories", href: "/categories", icon: FaTags },
    { name: "Contact Us", href: "/contact", icon: FaEnvelope },
  ];

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-center">
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className="relative px-5 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-200 font-medium text-sm group rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Icon className="text-sm group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      link.badge === "New" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-3/4 transition-all duration-300"></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navbarthrid;
