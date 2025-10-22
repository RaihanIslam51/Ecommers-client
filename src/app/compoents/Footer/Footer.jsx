"use client";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP, FaHome, FaHeart, FaUser, FaTag } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-white bg-black">
      {/* Desktop Footer */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BDMart.com</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Complaint Box</a></li>
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Branches</a></li>
              <li><a href="#" className="hover:text-white">Warranty</a></li>
              <li><a href="#" className="hover:text-white">Repair and Services</a></li>
              <li><a href="#" className="hover:text-white">EMI</a></li>
              <li><a href="#" className="hover:text-white">Glossary</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Order Procedure</a></li>
              <li><a href="#" className="hover:text-white">Return, Refund & Cancelation</a></li>
              <li><a href="#" className="hover:text-white">Payment Method</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white">ডিজিটাল কমার্স নির্দেশিকা ২০২১</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <div>Contact Us</div>
              <div className="font-medium">Head office</div>
              <div>BDMart.com</div>
              <div>Kusholi Bhaban, 4th Floor, 238/1 Begum Rokeya Sharani, Agargaon, Dhaka-1207</div>
              <div>16 810</div>
              <div>
                <a href="tel:09609016810" className="hover:text-white">09609016810</a>
                <span className="mx-2">,</span>
                <a href="tel:+8801755513900" className="hover:text-white">+8801755513900 (Message only)</a>
              </div>
              <div>
                <a href="#" className="text-sm text-blue-300 hover:underline" aria-label="See in Map">See in Map</a>
              </div>
            </address>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal & Notices</h3>
            <p className="text-sm text-gray-300">Prices are subject to change without any prior notice.</p>
            <p className="mt-3 text-sm text-gray-300">Product data used in this website is based solely on its manufacturer provided information. Authenticity and accuracy are their responsibility only.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>BDMart.com © 2025 All Rights Reserved. Designed by BDMart.com</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <div className="flex items-center gap-3 ml-4">
              <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
              <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
              <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
              <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
              <a href="#" className="hover:text-red-600"><FaYoutube /></a>
              <a href="#" className="hover:text-red-400"><FaPinterestP /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-900 border-t border-gray-800 flex justify-around items-center h-14 text-white">
        <Link href="/" className="flex flex-col items-center justify-center text-sm">
          <FaHome size={20} />
          <span>Home</span>
        </Link>
        <Link href="/offers" className="flex flex-col items-center justify-center text-sm">
          <FaTag size={20} />
          <span>Offers</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-sm">
          <FaUser size={20} />
          <span>Account</span>
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center justify-center text-sm">
          <FaHeart size={20} />
          <span>Favorite</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
