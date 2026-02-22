'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Tag,
  Truck,
  CreditCard,
  MessageSquare,
  Bell,
  FileText,
  ChevronRight,
  Store,
  X,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Image,
  ArrowLeft,
  Mail
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'E-Commerce',
      items: [
        { name: 'Products', href: '/dashboard/products', icon: Package},
        { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart},
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Categories', href: '/dashboard/categories', icon: Tag },
        { name: 'Banners', href: '/dashboard/banners', icon: Image},
        // { name: 'Inventory', href: '/dashboard/inventory', icon: ShoppingBag, badge: null },
        { name: 'Shipping', href: '/dashboard/shipping', icon: Truck },
      ]
    },
    {
      title: 'Support & System',
      items: [
        { name: 'Users', href: '/dashboard/users', icon: Users},
        { name: 'Email Customers', href: '/dashboard/email', icon: Mail},
        // { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare, badge: '12' },
        // { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '5' },
        // { name: 'Settings', href: '/dashboard/settings', icon: Settings, badge: null },
        // { name: 'Store Setup', href: '/dashboard/store-setup', icon: Store, badge: null },
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className="h-full mt-8 bg-white shadow-sm flex flex-col border-l border-gray-200 w-full lg:w-72">
      {/* Back Button */}
      <div className="sm:p-3 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 py-2 sm:py-2.5 rounded-xl transition-all duration-300 w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm active:scale-95"
        >
          <div className="p-1 sm:p-1 rounded-lg bg-white group-hover:bg-gray-100 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-black transition-colors" />
          </div>
          <span className="font-medium text-sm sm:text-base text-gray-700 group-hover:text-black">
            Back
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 sm:py-2  space-y-2 sm:space-y-3 hide-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-1.5 sm:px-2 mb-2 sm:mb-3 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="flex-1">{section.title}</span>
              <span className="h-px flex-1 bg-gray-200"></span>
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const isHovered = hoveredItem === item.name;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onTouchStart={() => setHoveredItem(item.name)}
                    className={`
                      group flex items-center justify-between px-1.5 sm:px-2 py-2 sm:py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden
                      active:scale-95 touch-manipulation
                      ${active
                        ? 'bg-gray-100 text-black shadow-sm scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Animated background effect */}
                    {isHovered && !active && (
                      <div className="absolute inset-0 bg-gray-100/60 animate-pulse"></div>
                    )} 
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 min-w-0">
                      <div className={`
                        p-1 sm:p-1 rounded-lg transition-all duration-300 flex-shrink-0
                        ${active 
                          ? 'bg-gray-100' 
                          : 'bg-gray-50 group-hover:bg-gray-100'
                        }
                      `}>
                        <Icon 
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                            active ? 'text-black' : 'text-gray-600 group-hover:text-black'
                          } ${isHovered || active ? 'scale-110 rotate-3' : ''}`} 
                        />
                      </div>
                      <span className={`font-medium text-xs sm:text-sm transition-all duration-200 truncate ${
                        active ? 'text-black' : 'text-gray-700 group-hover:text-black'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    
                    {/* <div className="flex items-center gap-1 sm:gap-1.5 relative z-10 flex-shrink-0">
                      {item.badge && (
                        <span className={`
                          px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold transition-all duration-200
                          ${active ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}
                        `}>
                          {item.badge}
                        </span> 
                      )}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      )}
                    </div> */}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      
     
    </div>
    </>
  );
};

export default Sidebar;
