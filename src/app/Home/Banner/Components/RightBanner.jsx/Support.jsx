"use client";
import React from "react";
import {  FaUserTie,  FaRegCommentDots } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const supportFeatures = [
  {
    id: 2,
    title: "24/7 Online Support",
    icon: <FaUserTie size={24} className="text-indigo-500" />,
  },
  {
    id: 3,
    title: "Raise a Complaint",
    icon: <FaRegCommentDots size={24} className="text-indigo-500" />,
  },
  {
    id: 4,
    title: "Cash on delivery in 64 districts",
    icon: <TbTruckDelivery size={24} className="text-indigo-500" />,
  },
];

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Announcement bar */}
      <div className="mb-4">
        <marquee
          behavior="scroll"
          direction="left"
          className="bg-indigo-600/90 text-white py-2 px-4 rounded-lg shadow-inner font-medium text-sm sm:text-base"
          aria-hidden={false}
        >
          Fast delivery across Bangladesh · Free returns within 7 days · Secure payments &amp; verified sellers
        </marquee>
      </div>

      {/* Feature chips */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-3 sm:gap-6 bg-white/5 p-3 rounded-lg">
        {supportFeatures.map((feature, index) => (
          <div
            key={feature.id}
            className="flex items-center gap-3 bg-transparent px-3 py-2 rounded-md"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
              {feature.icon}
            </div>
            <div className="text-left">
              <h4 className="text-sm sm:text-base font-semibold text-black/90">{feature.title}</h4>
              {/* small description placeholder for future use (kept empty to not change logic) */}
              <div className="text-xs text-gray-300 hidden">&nbsp;</div>
            </div>

            {/* vertical separator for md+ screens */}
            {index !== supportFeatures.length - 1 && (
              <div className="hidden md:block h-8 w-px bg-white/10 mx-2" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
