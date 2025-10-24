"use client";
import React, { useState, useEffect } from "react";
import Navbarfirst from "./components/Navbarfirst";
import Navbarsecond from "./components/Navbarsecond";
import Navbarthrid from "./components/Navbarthrid";

const Navbar = () => {
  const [hideTopBottom, setHideTopBottom] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // নিচে scroll করলে hide হবে
      if (currentScrollY > lastScrollY + 10) {
        setHideTopBottom(true);
      }
      // উপরে scroll করলে আবার show হবে
      else if (currentScrollY < lastScrollY - 10) {
        setHideTopBottom(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-sm bg-black/90 text-white shadow-lg border-b border-gray-800 transition-all duration-500">
      <div className="w-full flex flex-col">

        {/* === Top Section (Navbarfirst) === */}
        <div
          className={`hidden md:flex items-center justify-center bg-transparent text-xs sm:text-sm transition-all duration-500 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-8"
          }`}
        >
          <div className="max-w-7xl w-full mx-auto px-4">
            <Navbarfirst />
          </div>
        </div>

        {/* === Middle Section (Navbarsecond) === */}
        <div className="h-14 md:h-20 bg-transparent text-xs sm:text-sm transition-all duration-500">
          <div className="max-w-7xl w-full mx-auto px-4">
            <Navbarsecond />
          </div>
        </div>

        {/* === Bottom Section (Navbarthrid) === */}
        <div
          className={`hidden md:flex bg-transparent text-xs sm:text-sm transition-all duration-500 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-8"
          }`}
        >
          <div className="max-w-7xl mx-auto w-full px-4">
            <Navbarthrid />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
