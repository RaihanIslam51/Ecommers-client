'use client';
import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn, FaTelegram, FaLink, FaEnvelope } from 'react-icons/fa';
import { SiMessenger } from 'react-icons/si';

const SocialShare = ({ product, url }) => {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Get the current page URL
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const productTitle = product?.name || 'Check out this product';
    const productDescription = product?.description || 'Amazing product available now!';
    const productPrice = product?.price || '';
    const productImage = product?.image || '';

    // Encode text for URLs
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(productTitle);
    const encodedText = encodeURIComponent(`${productTitle} - Only $${productPrice}\n${productDescription.substring(0, 100)}...`);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: FaFacebookF,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            label: 'Share on Facebook'
        },
        {
            name: 'Messenger',
            icon: SiMessenger,
            color: 'bg-blue-500 hover:bg-blue-600',
            url: `fb-messenger://share/?link=${encodedUrl}`,
            label: 'Share via Messenger'
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-green-600 hover:bg-green-700',
            url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            label: 'Share on WhatsApp'
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
            label: 'Share on Twitter'
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            label: 'Share on LinkedIn'
        },
        {
            name: 'Telegram',
            icon: FaTelegram,
            color: 'bg-sky-400 hover:bg-sky-500',
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            label: 'Share on Telegram'
        },
        {
            name: 'Email',
            icon: FaEnvelope,
            color: 'bg-gray-600 hover:bg-gray-700',
            url: `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`,
            label: 'Share via Email'
        }
    ];

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowShareMenu(false);
        }, 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productTitle,
                    text: `${productTitle} - Only $${productPrice}`,
                    url: shareUrl
                });
                setShowShareMenu(false);
            } catch (error) {
                console.log('Error sharing:', error);
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-all duration-300 font-semibold border border-gray-300"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>

            {showShareMenu && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowShareMenu(false)}
                    ></div>

                    {/* Share Menu */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                            <h3 className="font-bold text-gray-800 text-lg">Share this product</h3>
                            <p className="text-sm text-gray-600 mt-1">Choose where to share</p>
                        </div>

                        <div className="p-4">
                            {/* Social Media Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {shareLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <button
                                            key={link.name}
                                            onClick={() => handleShare(link.url)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg ${link.color} text-white transition-all duration-300 transform hover:scale-105 active:scale-95`}
                                            title={link.label}
                                        >
                                            <Icon className="text-xl" />
                                            <span className="text-xs font-medium">{link.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Copy Link Section */}
                            <div className="border-t border-gray-200 pt-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                            copied 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-800 text-white hover:bg-gray-900'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <FaLink className="text-sm" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Native Share (Mobile) */}
                            {typeof navigator !== 'undefined' && navigator.share && (
                                <button
                                    onClick={handleNativeShare}
                                    className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    More Options
                                </button>
                            )}
                        </div>

                        {/* Product Preview */}
                        {product && (
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                <div className="flex gap-3 items-center">
                                    {productImage && (
                                        <img 
                                            src={productImage} 
                                            alt={productTitle} 
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-gray-800 truncate">{productTitle}</p>
                                        <p className="text-lg font-bold text-blue-600">${productPrice}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SocialShare;
