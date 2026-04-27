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
  Mail,
} from 'lucide-react';

const menuSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard',           icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'E-Commerce',
    items: [
      { name: 'Products',   href: '/dashboard/products',   icon: Package },
      { name: 'Orders',     href: '/dashboard/orders',     icon: ShoppingCart },
      { name: 'Customers',  href: '/dashboard/customers',  icon: Users },
      { name: 'Categories', href: '/dashboard/categories', icon: Tag },
      { name: 'Banners',    href: '/dashboard/banners',    icon: Image },
      { name: 'Shipping',   href: '/dashboard/shipping',   icon: Truck },
    ],
  },
  {
    title: 'Support & System',
    items: [
      { name: 'Users',           href: '/dashboard/users',  icon: Users },
      { name: 'Email Customers', href: '/dashboard/email',  icon: Mail },
    ],
  },
];

const Sidebar = ({ onClose }) => {
  const pathname  = usePathname();
  const router    = useRouter();

  const isActive = (href) =>
    href === '/dashboard' ? pathname === href : pathname?.startsWith(href);

  return (
    <>
      {/* Hide scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-scroll::-webkit-scrollbar { display: none; }
        .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="h-full flex flex-col bg-white border-r border-gray-100 w-full">

        {/* ── BRAND HEADER ── */}
        <div className="px-5 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium tracking-tight text-gray-900">BDmart</p>
              <p className="text-xs text-gray-400 mt-0.5">Admin panel</p>
            </div>
            {/* Mobile close */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── BACK BUTTON ── */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => router.back()}
            className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors active:scale-[0.98]"
          >
            <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-gray-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-900 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              Go back
            </span>
          </button>
        </div>

        {/* ── NAVIGATION ── */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 pt-2 pb-6 space-y-5">
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section label */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                  {section.title}
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon   = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        group flex items-center justify-between px-3 py-2.5 rounded-xl
                        transition-all duration-150 active:scale-[0.98] touch-manipulation
                        ${active
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Icon box */}
                        <div className={`
                          w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                          ${active
                            ? 'bg-white/10'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                          }
                        `}>
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                            active ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'
                          }`} />
                        </div>

                        {/* Label */}
                        <span className={`text-sm font-medium truncate transition-colors ${
                          active ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.name}
                        </span>
                      </div>

                      {/* Active chevron */}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── FOOTER ── */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-white">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@bdmart.com</p>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
          </div>
        </div>

      </div>
    </>
  );
};

export default Sidebar;