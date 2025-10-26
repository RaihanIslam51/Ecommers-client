'use client';
import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Whatsapp = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const phoneNumber = "8801956486761"; // Your WhatsApp number
    const message = "Hello! I'm interested in your products."; // Default message

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
            {/* Tooltip/Message Bubble */}
            <div
                className={`
                    bg-white shadow-2xl rounded-lg px-4 py-3 
                    transition-all duration-300 ease-in-out
                    ${showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
                `}
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Need Help?</p>
                        <p className="text-xs text-gray-600">Chat with us on WhatsApp</p>
                    </div>
                </div>
                {/* Triangle pointer */}
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 
                    border-t-[6px] border-t-transparent
                    border-l-[6px] border-l-white
                    border-b-[6px] border-b-transparent">
                </div>
            </div>

            {/* WhatsApp Button */}
            <div className="relative">
                {/* Pulse animation ring */}
                <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"></span>
                
                {/* Main button */}
                <a
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="
                        relative flex items-center justify-center
                        w-14 h-14 md:w-16 md:h-16
                        bg-gradient-to-br from-green-400 to-green-600
                        hover:from-green-500 hover:to-green-700
                        text-white rounded-full
                        shadow-lg hover:shadow-2xl
                        transform hover:scale-110 active:scale-95
                        transition-all duration-300 ease-in-out
                        group
                    "
                    aria-label="Chat on WhatsApp"
                >
                    <FaWhatsapp 
                        className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" 
                    />
                    
                    {/* Notification badge (optional) */}
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[10px] font-bold text-white">
                            1
                        </span>
                    </span>
                </a>
            </div>
        </div>
    );
};

export default Whatsapp;
