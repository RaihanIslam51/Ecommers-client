"use client";
import React, { useState, useEffect } from "react";

/**
 * Professional Full Page Loader
 * Displays when the website is initially loading
 * Creates a premium brand experience for users
 */
const PageLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Mark as loaded and start fade out
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1800);

    // Complete hide after fade animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }, 1300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(loadTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        isLoaded ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ zIndex: 9999 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-100">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse-slow animation-delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse-slow animation-delay-500" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo/Brand Section */}
        <div className="relative animate-fade-in">
          {/* Logo Container with Glow Effect */}
          <div className="relative">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 -m-4 bg-linear-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse-slow" />
            
            {/* Middle Glow Ring */}
            <div className="absolute inset-0 -m-2 bg-white/50 rounded-full blur-md animate-pulse-slow animation-delay-200" />
            
            {/* Logo Circle */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-100">
              {/* Brand Text */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-600 via-emerald-600 to-teal-600">
                  RK
                </h1>
                <p className="text-xs md:text-sm font-bold text-green-600 -mt-1">Kaj</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2 animate-slide-up animation-delay-200">
          <h2 className="text-3xl md:text-4xl font-black text-green-700 tracking-tight">
            RannerKaj.com
          </h2>
          <p className="text-sm md:text-base text-green-600 font-medium">
            Fresh, Organic, Ready-to-Cook Meals
          </p>
        </div>

        {/* Loading Animation */}
        <div className="w-64 md:w-80 space-y-3 animate-slide-up animation-delay-400">
          {/* Progress Bar Container */}
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Animated Progress Bar */}
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Effect on Progress Bar */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <span className="font-medium">Loading</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce animation-delay-100" />
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce animation-delay-200" />
            </div>
          </div>
        </div>

        {/* Spinning Ring Loader (Alternative/Additional) */}
        <div className="absolute bottom-20 animate-fade-in animation-delay-500">
          <div className="relative w-16 h-16">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            {/* Spinning Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-green-700 border-r-green-500 rounded-full animate-spin" />
          </div>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animation-delay-500">
        <p className="text-xs md:text-sm text-green-500 font-medium">
          Fresh Vegetables • Healthy Meals • Hygienic Delivery
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
