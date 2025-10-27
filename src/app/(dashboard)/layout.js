'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="max-w-7xl mx-auto min-h-screen -mt-35 bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
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
        <div className="flex-1 flex bg-amber-50 flex-col overflow-hidden w-full">
          <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Main Content with Scroll */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
              <div className="max-w-full">
                {children}
              </div>
            </div>
          </main>

          {/* Footer */}
      
        </div>
      </div>
    </div>
    </SessionProvider>
  );
}