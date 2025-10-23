"use client";
import React from "react";
import {  FaUserTie,  FaRegCommentDots } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

const supportFeatures = [
  {
    id: 2,
    title: "24/7 Online Support",
    icon: < FaUserTie size={28} className="text-blue-600" />,
  },
  {
    id: 3,
    title: "Raise a Complain",
    icon: < FaRegCommentDots size={28} className="text-blue-600" />,
  },
  {
    id: 4,
    title: " Cash on delivery in 64 districts",
    icon: <TbTruckDelivery size={28} className="text-blue-600" />,
  },
];

const Support = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Marquee / Announcement */}
      <div className="mb-4">
        <marquee
          behavior="scroll"
          direction="left"
          className="text-gray-700 py-2 px-4 rounded-lg shadow-inner font-medium text-sm sm:text-base"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit officia aut quaerat ducimus? Fuga dolore, quae cumque, voluptatem molestiae illo atque aliquam reiciendis fugiat est maxime quas magni quidem corrupti, dolores reprehenderit debitis tenetur! Fugiat veniam sapiente laborum sequi omnis vitae ratione, dolor expedita repellat, iusto ipsum mollitia nihil quia.
        </marquee>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        {supportFeatures.map((feature, index) => (
          <React.Fragment key={feature.id}>
            <div className="flex items-center gap-x-2 text-gray-800 text-sm sm:text-base">
              {/* Icon */}
              <div className=" ">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-sm sm:text-lg font-semibold">{feature.title}</h3>
            </div>

            {/* Separator "|" except after the last item */}
            {index !== supportFeatures.length - 1 && (
              <div className="text-gray-400 select-none hidden sm:block">|</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Support;
