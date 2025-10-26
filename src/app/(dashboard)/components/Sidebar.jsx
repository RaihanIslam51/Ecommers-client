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
  ArrowLeft
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, badge: 'New' },
      ]
    },
    {
      title: 'E-Commerce',
      items: [
        { name: 'Products', href: '/dashboard/products', icon: Package, badge: '1.2k' },
        { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, badge: '45' },
        { name: 'Customers', href: '/dashboard/customers', icon: Users, badge: null },
        { name: 'Categories', href: '/dashboard/categories', icon: Tag, badge: null },
        { name: 'Banners', href: '/dashboard/banners', icon: Image, badge: null },
        { name: 'Inventory', href: '/dashboard/inventory', icon: ShoppingBag, badge: null },
        { name: 'Shipping', href: '/dashboard/shipping', icon: Truck, badge: null },
      ]
    },
    {
      title: 'Support & System',
      items: [
        { name: 'Users', href: '/dashboard/users', icon: Users, badge: null },
        { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare, badge: '12' },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '5' },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, badge: null },
        { name: 'Store Setup', href: '/dashboard/store-setup', icon: Store, badge: null },
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
    <div className="h-full bg-white shadow-xl flex flex-col border-r border-gray-200">
      {/* Back Button */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 w-full
            bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50
            border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md active:scale-95"
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-white group-hover:bg-blue-100 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </div>
          <span className="font-medium text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
            Back
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-2 sm:px-3 mb-2 sm:mb-3 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="flex-1">{section.title}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></span>
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
                      group flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden
                      active:scale-95 touch-manipulation
                      ${active
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Animated background effect */}
                    {isHovered && !active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 animate-pulse"></div>
                    )}
                    
                    <div className="flex items-center gap-2 sm:gap-3 relative z-10 min-w-0">
                      <div className={`
                        p-1 sm:p-1.5 rounded-lg transition-all duration-300 flex-shrink-0
                        ${active 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100'
                        }
                      `}>
                        <Icon 
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                            active ? 'text-white' : 'text-blue-600 group-hover:text-indigo-600'
                          } ${isHovered || active ? 'scale-110 rotate-3' : ''}`} 
                        />
                      </div>
                      <span className={`font-medium text-xs sm:text-sm transition-all duration-200 truncate ${
                        active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2 relative z-10 flex-shrink-0">
                      {item.badge && (
                        <span className={`
                          px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold transition-all duration-200
                          ${active 
                            ? 'bg-white/20 text-white' 
                            : item.badge === 'New'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 group-hover:from-blue-200 group-hover:to-indigo-200'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      
     
    </div>
  );
};

export default Sidebar;
