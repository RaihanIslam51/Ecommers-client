'use client';
import React, { useState } from 'react';
import { FaWhatsapp, FaComments, FaRobot } from 'react-icons/fa';
import LiveChatModal from '@/components/LiveChat/LiveChatModal';

const Whatsapp = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showLiveChat, setShowLiveChat] = useState(false);
    const phoneNumber = "8801761043428"; // Your WhatsApp number
    const message = "Hello! I'm interested in your products."; // Default message

    const menuItems = [
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700',
            bgColor: 'bg-green-500',
            action: () => window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
        },
        {
            id: 'chat',
            name: 'Live Chat',
            icon: FaComments,
            color: 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700',
            bgColor: 'bg-blue-500',
            action: () => {
                setShowLiveChat(true);
                setShowMenu(false);
            }
        },
        {
            id: 'ai',
            name: 'AI Assistant',
            icon: FaRobot,
            color: 'bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700',
            bgColor: 'bg-purple-500',
            action: () => {
                // You can integrate with your AI chatbot here
                alert('AI Assistant feature coming soon!');
            }
        }
    ];

    return (
      <div>

          <div className="fixed bottom-6 right-6 z-50">
          
            <div
                className={`
                    absolute bottom-20 right-0
                    bg-white shadow-2xl rounded-lg px-4 py-3 
                    transition-all duration-300 ease-in-out
                    ${showTooltip && !showMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                `}
            >
                <div className="flex items-center gap-2">
                    <div className="flex-1 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-800">Need Help?</p>
                        <p className="text-xs text-gray-600">Click to see options</p>
                    </div>
                </div>
              
                <div className="absolute -bottom-1.5 right-6 w-0 h-0 
                    border-l-[6px] border-l-transparent
                    border-t-[6px] border-t-white
                    border-r-[6px] border-r-transparent">
                </div>
            </div>

          
            <div className={`
                flex flex-col gap-3 mb-4
                transition-all duration-300 ease-in-out
                ${showMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}>
                {menuItems.map((item, index) => (
                    <div
                        key={item.id}
                        className={`
                            flex items-center gap-3 justify-end
                            transition-all duration-300
                            ${showMenu ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
                        `}
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                     
                        <span className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 whitespace-nowrap">
                            {item.name}
                        </span>
                        
                       
                        <button
                            onClick={item.action}
                            className={`
                                flex items-center justify-center
                                w-12 h-12
                                ${item.color}
                                text-white rounded-full
                                shadow-lg hover:shadow-2xl
                                transform hover:scale-110 active:scale-95
                                transition-all duration-300 ease-in-out
                            `}
                            aria-label={item.name}
                        >
                            <item.icon className="w-6 h-6" />
                        </button>
                    </div>
                ))}
            </div>

           
            <div className="relative flex justify-end">
                
                <span className={`
                    absolute inset-0 rounded-full
                    ${!showMenu ? 'animate-ping' : ''}
                `}></span>
                
               
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`
                        relative flex items-center justify-center
                        w-14 h-14 md:w-16 md:h-16
                        ${showMenu 
                            ? 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 rotate-45' 
                            : 'bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-500 hover:to-blue-700'
                        }
                        text-white rounded-full
                        shadow-lg hover:shadow-2xl
                        transform hover:scale-110 active:scale-95
                        transition-all duration-300 ease-in-out
                        group
                    `}
                    aria-label={showMenu ? "Close menu" : "Open help menu"}
                >
                    {showMenu ? (
                       
                        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                       
                        <FaComments className="w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" />
                    )}
                    
                   
                    {!showMenu && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-[10px] font-bold text-white">
                                3
                            </span>
                        </span>
                    )}
                </button>
            </div>

           
            <LiveChatModal 
                isOpen={showLiveChat} 
                onClose={() => setShowLiveChat(false)} 
            />
        </div>

        
      </div>
    );
};

export default Whatsapp;
