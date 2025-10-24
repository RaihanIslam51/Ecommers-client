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
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-300">
      <div className="w-full flex flex-col shadow-sm">

        {/* === Top Section (Navbarfirst) === */}
        <div
          className={`hidden lg:flex items-center justify-center bg-black text-xs transition-all duration-300 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-8"
          }`}
        >
          <div className="max-w-[1400px] w-full mx-auto px-6 xl:px-8">
            <Navbarfirst />
          </div>
        </div>

        {/* === Middle Section (Navbarsecond) === */}
        <div className="h-16 md:h-[68px] bg-white text-xs transition-all duration-300">
          <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 xl:px-8">
            <Navbarsecond />
          </div>
        </div>

        {/* === Bottom Section (Navbarthrid) === */}
        <div
          className={`hidden lg:flex bg-white text-xs transition-all duration-300 border-t border-gray-100 ${
            hideTopBottom ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-10"
          }`}
        >
          <div className="max-w-[1400px] mx-auto w-full px-6 xl:px-8">
            <Navbarthrid />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
