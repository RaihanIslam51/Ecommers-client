'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { OrderProvider } from '@/context/OrderContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <OrderProvider>
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
        <div className="w-full min-h-screen -mt-35 bg-linear-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex bg-white flex-col overflow-hidden w-full">
          <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Main Content with Scroll */}
          {/* main area gets negative margins so page-level padding doesn't create unwanted gap to sidebar */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
            {children}
          </main>

          {/* Footer */}
      
        </div>
      </div>
        </div>
      </OrderProvider>
    </SessionProvider>
  );
}