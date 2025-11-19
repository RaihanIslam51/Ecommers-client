'use client';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Whatsapp = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const phoneNumber = "8801761043428"; // Your WhatsApp number
    const message = "Hello! I'm interested in your products."; // Default message

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed bottom-18 right-6 z-50">
            {/* Tooltip */}
            <div
                className={`
                    absolute bottom-20 right-0
                    bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-100
                    transition-all duration-300 ease-in-out
                    ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                `}
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-800">Chat with us on WhatsApp</p>
                        <p className="text-xs text-gray-600">Get instant support</p>
                    </div>
                </div>
                <div className="absolute -bottom-1.5 right-6 w-0 h-0 
                    border-l-[6px] border-l-transparent
                    border-t-[6px] border-t-white
                    border-r-[6px] border-r-transparent">
                </div>
            </div>

            {/* WhatsApp Button */}
            <div className="relative">
                <button
                    onClick={handleWhatsAppClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="
                        relative flex items-center justify-center
                        w-10 h-10 md:w-13 md:h-13
                        bg-linear-to-br from-green-500 to-green-600
                        hover:from-green-600 hover:to-green-700
                        text-white rounded-full
                        shadow-lg hover:shadow-2xl
                        transform hover:scale-110 active:scale-95
                        transition-all duration-300 ease-in-out
                        group
                    "
                    aria-label="Contact us on WhatsApp"
                >
                    <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
                    
                  
                </button>
            </div>
        </div>
    );
};

export default Whatsapp;
