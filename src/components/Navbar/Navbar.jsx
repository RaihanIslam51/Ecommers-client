"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Navbarfirst from "./components/Navbarfirst";
import Navbarsecond from "./components/Navbarsecond";

const Navbar = () => {
  const [hideTopBar, setHideTopBar] = useState(false);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth >= 1024) {
        if (currentScrollY > 120 && currentScrollY > lastScrollYRef.current + 8) {
          setHideTopBar(true);
        } else if (currentScrollY < lastScrollYRef.current - 8) {
          setHideTopBar(false);
        }
      }
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 transition-all duration-300">
        <div className="w-full flex flex-col">

          {/* Top utility bar */}
          <div
            className={`hidden lg:block border-b border-gray-100 transition-all duration-300 overflow-hidden ${
              hideTopBar ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
            }`}
          >
            <div className="w-full px-6 xl:px-10">
              <Navbarfirst />
            </div>
          </div>

          {/* Main navigation bar */}
          <div className="h-[68px] bg-white">
            <div className="w-full h-full px-4 md:px-6 xl:px-10">
              <Navbarsecond />
            </div>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;

