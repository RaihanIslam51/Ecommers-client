'use client';
import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaTelegram, FaShare } from 'react-icons/fa';
import { SiMessenger } from 'react-icons/si';

const FloatingShareButton = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const productTitle = product?.name || 'Check out this product';
    const productPrice = product?.price || '';
    const productDescription = product?.description || '';

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${productTitle} - Only $${productPrice}\n${productDescription.substring(0, 100)}...`);

    const shareButtons = [
        {
            name: 'Facebook',
            icon: FaFacebookF,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        },
        {
            name: 'Messenger',
            icon: SiMessenger,
            color: 'bg-blue-500 hover:bg-blue-600',
            url: `fb-messenger://share/?link=${encodedUrl}`
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-green-600 hover:bg-green-700',
            url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        },
        {
            name: 'Telegram',
            icon: FaTelegram,
            color: 'bg-sky-400 hover:bg-sky-500',
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        }
    ];

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <div className="fixed bottom-24 right-6 z-50">
            {/* Social Share Buttons */}
            <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {shareButtons.map((button) => {
                    const Icon = button.icon;
                    return (
                        <button
                            key={button.name}
                            onClick={() => handleShare(button.url)}
                            className={`w-12 h-12 ${button.color} text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300`}
                            title={`Share on ${button.name}`}
                        >
                            <Icon className="text-lg" />
                        </button>
                    );
                })}
            </div>

            {/* Main Share Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
                    isOpen 
                        ? 'bg-red-500 hover:bg-red-600 rotate-45' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                }`}
            >
                <FaShare className={`text-xl transition-transform duration-300 ${isOpen ? 'rotate-0' : ''}`} />
            </button>
        </div>
    );
};

export default FloatingShareButton;
