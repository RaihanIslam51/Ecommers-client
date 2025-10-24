"use client";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
  FaHome,
  FaHeart,
  FaUser,
  FaTag,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer - Desktop */}
      <div className="hidden md:block">
        {/* Top Section */}
        <div className="bg-black border-b border-gray-800">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
              {/* Brand & Newsletter */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black mb-3 tracking-tight">
                    BDMart
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Your trusted global marketplace for quality products, fast shipping, and exceptional service.
                  </p>
                </div>

                {/* Newsletter */}
                <div>
                  <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-widest">
                    Newsletter
                  </h4>
                  <form
                    className="flex items-center"
                    onSubmit={(e) => e.preventDefault()}
                    aria-label="Subscribe to newsletter"
                  >
                    <label htmlFor="newsletter" className="sr-only">
                      Email address
                    </label>
                    <div className="relative w-full">
                      <input
                        id="newsletter"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full py-2.5 px-4 bg-gray-900 text-white placeholder-gray-500 text-sm border border-gray-800 focus:border-white focus:outline-none transition-colors rounded-l-md"
                      />
                      <button
                        type="submit"
                        className="absolute right-0 top-0 bottom-0 px-5 bg-white hover:bg-gray-200 text-black font-bold text-xs rounded-r-md transition-colors duration-200"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" size={14} />
                    <span>support@bdmart.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span>+880 1956-486761</span>
                  </div>
                </div>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-xs font-bold mb-5 text-white uppercase tracking-widest">
                  Company
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Blog & News
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Store Locations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="text-xs font-bold mb-5 text-white uppercase tracking-widest">
                  Support
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Track Order
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Returns & Refunds
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact & Address */}
              <div>
                <h3 className="text-xs font-bold mb-5 text-white uppercase tracking-widest">
                  Head Office
                </h3>
                <address className="not-italic text-sm text-gray-400 leading-relaxed space-y-3">
                  <p>
                    Kusholi Bhaban, 4th Floor<br />
                    238/1 Begum Rokeya Sharani<br />
                    Agargaon, Dhaka-1207<br />
                    Bangladesh
                  </p>
                  <div className="space-y-1 pt-2">
                    <div>
                      <a href="tel:09609016810" className="hover:text-white transition-colors duration-200">
                        09609 016810
                      </a>
                    </div>
                    <div>
                      <a href="tel:+8801755513900" className="hover:text-white transition-colors duration-200">
                        +880 1755 513900
                      </a>
                    </div>
                  </div>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-black border-t border-gray-900">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Copyright */}
              <div className="text-sm text-gray-500">
                <span>© {new Date().getFullYear()} BDMart. All rights reserved.</span>
              </div>

              {/* Social & Payment */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Social Media */}
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-900 hover:bg-white text-gray-400 hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={14} />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-900 hover:bg-white text-gray-400 hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={14} />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-900 hover:bg-white text-gray-400 hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={14} />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-gray-900 hover:bg-white text-gray-400 hover:text-black flex items-center justify-center transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn size={14} />
                  </a>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-600">Payment:</span>
                  <div className="flex items-center gap-2 text-2xl text-gray-600">
                    <FaCcVisa className="hover:text-white transition-colors duration-200" />
                    <FaCcMastercard className="hover:text-white transition-colors duration-200" />
                    <FaCcPaypal className="hover:text-white transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-50 shadow-xl">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-black transition-colors duration-200 flex-1 h-full active:bg-gray-50"
          >
            <FaHome size={18} />
            <span className="mt-1.5 font-medium text-[10px]">Home</span>
          </Link>
          <Link
            href="/offers"
            className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-black transition-colors duration-200 flex-1 h-full active:bg-gray-50"
          >
            <FaTag size={18} />
            <span className="mt-1.5 font-medium text-[10px]">Offers</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-black transition-colors duration-200 flex-1 h-full active:bg-gray-50"
          >
            <FaUser size={18} />
            <span className="mt-1.5 font-medium text-[10px]">Account</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-black transition-colors duration-200 flex-1 h-full active:bg-gray-50"
          >
            <FaHeart size={18} />
            <span className="mt-1.5 font-medium text-[10px]">Wishlist</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
