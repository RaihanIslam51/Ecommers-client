"use client";
import React from "react";
import Navbarfirst from "./components/Navbarfirst";
import Navbarsecond from "./components/Navbarsecond";
import Navbarthrid from "./components/Navbarthrid";
// import Navbarfirst from "./components/Navbarfirst";
// import Navbarsecond from "./components/Navbarsecond";
// import Navbarthrid from "./components/Navbarthrid";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-black text-white shadow-md border-b border-gray-800">
      <div className="w-full flex flex-col">

        {/* === Top Section (hidden on mobile) === */}
        <div className="hidden md:flex h-6 md:h-8 items-center justify-center bg-gray-900 text-xs sm:text-sm">
          <Navbarfirst />
        </div>

        {/* === Middle Section (always visible) === */}
        <div className="h-12 md:h-16 bg-gray-900 text-xs sm:text-sm">
          <Navbarsecond />
        </div>

        {/* === Bottom Section (hidden on mobile) === */}
        <div className="hidden md:flex h-10 md:h-7 bg-gray-900 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto w-full">
            <Navbarthrid />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
