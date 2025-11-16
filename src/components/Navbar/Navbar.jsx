"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // ✅ Path check করার জন্য
import Navbarfirst from "./components/Navbarfirst";
import Navbarsecond from "./components/Navbarsecond";
import Navbarthrid from "./components/Navbarthrid";

const Navbar = () => {
  const [hideTopBottom, setHideTopBottom] = useState(false);
  // use a ref for lastScrollY so the scroll handler doesn't trigger
  // effect re-creation on every scroll update (keeps hooks stable)
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only hide/show on larger screens and when scrolled significantly
      if (window.innerWidth >= 1024) {
        if (currentScrollY > 200 && currentScrollY > lastScrollYRef.current + 10) {
          setHideTopBottom(true);
        } else if (currentScrollY < lastScrollYRef.current - 10) {
          setHideTopBottom(false);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide navbar completely on admin dashboard for cleaner interface
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
   <div>
     {/* Main Navigation Container - Fixed positioning with professional styling */}
     <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-lg transition-all duration-300 border-b border-green-100">
      <div className="w-full flex flex-col">
       
        {/* Top Contact Bar - Hidden on scroll for cleaner look */}
        <div
          className={`hidden lg:flex items-center justify-center bg-green-50 text-xs transition-all duration-300 border-b border-green-200 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-10"
          }`}
        >
          <div className=" w-full mx-auto px-6 xl:px-8">
            <Navbarfirst />
          </div>
        </div>

        
        {/* Main Navigation Bar - Logo, Search, Cart, User Menu */}
        <div className="h-16 md:h-[70px] bg-white">
          <div className="w-full mx-auto px-4 md:px-4 xl:px-8 h-full">
            <Navbarsecond />
          </div>
        </div>

       
        {/* Bottom Navigation Menu - Links hidden on scroll for cleaner interface */}
        {/* <div
          className={`hidden lg:flex bg-green-50 transition-all duration-300 border-t border-green-200 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-12"
          }`}
        >
          <div className=" mx-auto w-full px-6 xl:px-8">
            <Navbarthrid />
          </div>
        </div> */}
      </div>
    </nav>
   </div>
  );
};

export default Navbar;
