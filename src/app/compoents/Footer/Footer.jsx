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
  <footer className="text-white bg-black/90">
      {/* Desktop / Large screens footer */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Newsletter */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-extrabold">
                <span className="text-blue-400">BD</span>
                <span className="text-indigo-400">Mart</span>
              </h2>
              <p className="mt-2 text-sm text-gray-300 max-w-sm">Global marketplace for everything you need — fast shipping, trusted sellers, and round-the-clock customer support.</p>
            </div>

            <form className="mt-4 flex items-center max-w-md" onSubmit={(e)=>e.preventDefault()} aria-label="Subscribe to newsletter">
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <div className="relative w-full">
                <input id="newsletter" type="email" placeholder="Enter your email" className="w-full py-3 pl-4 pr-28 rounded-lg bg-white/5 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">Subscribe</button>
              </div>
            </form>

            <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
              <FaEnvelope />
              <span>support@bdmart.com · +8801956-486761</span>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Branches</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Order Procedure</a></li>
              <li><a href="#" className="hover:text-white">Return, Refund & Cancellation</a></li>
              <li><a href="#" className="hover:text-white">Payment Method</a></li>
              <li><a href="#" className="hover:text-white">Warranty & Repairs</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Legal</h3>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <div className="font-medium">Head office</div>
              <div>Kusholi Bhaban, 4th Floor, 238/1 Begum Rokeya Sharani, Agargaon, Dhaka-1207</div>
              <div className="pt-2">
                <a href="tel:09609016810" className="hover:text-white">09609016810</a>
                <span className="mx-2">·</span>
                <a href="tel:+8801755513900" className="hover:text-white">+8801755513900</a>
              </div>
              <div className="mt-2 text-sm text-gray-400">Prices & product data may change. See individual product pages for exact details.</div>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-400 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>© {new Date().getFullYear()} BDMart.com</div>
            <span className="hidden sm:inline">·</span>
            <div className="hidden sm:block">All Rights Reserved.</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a href="#" className="text-gray-300 hover:text-indigo-300"><FaFacebookF /></a>
              <a href="#" className="text-gray-300 hover:text-sky-300"><FaTwitter /></a>
              <a href="#" className="text-gray-300 hover:text-pink-400"><FaInstagram /></a>
              <a href="#" className="text-gray-300 hover:text-blue-500"><FaLinkedinIn /></a>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-sm">Secure payments:</span>
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
  <div className="fixed bottom-0 left-0 right-0 md:hidden bg-linear-to-t from-gray-900 to-gray-800 border-t border-gray-800 flex justify-around items-center h-16 text-white">
        <Link href="/" className="flex flex-col items-center justify-center text-xs">
          <FaHome size={20} />
          <span>Home</span>
        </Link>
        <Link href="/offers" className="flex flex-col items-center justify-center text-xs">
          <FaTag size={20} />
          <span>Offers</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-xs">
          <FaUser size={20} />
          <span>Account</span>
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center justify-center text-xs">
          <FaHeart size={20} />
          <span>Favorite</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
