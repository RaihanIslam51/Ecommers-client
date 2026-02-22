'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import NotificationBell from '../dashboard/Components/NotificationBell';
import MessageBell from '../dashboard/Components/MessageBell';
// import LiveChatAdmin from '../dashboard/Components/LiveChatAdmin';
import { 
  Search,
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Maximize,
  Minimize,
  Globe,
  HelpCircle,
  X,
  Activity,
  Shield,
  Wifi,
  WifiOff,
  Check,
} from 'lucide-react';

// Language options
const LANGUAGES = [
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'BN', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'AR', name: 'العربية', flag: '🇸🇦' },
];

const Topbar = ({ 
  onMenuClick, 
  currentPage = 'Dashboard',
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // State Management
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  
  // Get user data from session or use defaults
  const user = {
    name: session?.user?.name || 'Admin User',
    email: session?.user?.email || 'admin@kannerkaj.com',
    role: session?.user?.role === 'admin' ? 'Administrator' : 'User',
    avatar: session?.user?.name ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AU',
    status: 'online'
  };
  
  // Refs for click outside detection
  const profileMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Event Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode implementation
    document.documentElement.classList.toggle('dark');
  };

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
    // Add language change implementation
  };

  const handleLogout = async () => {
    // Close the profile menu first
    setShowProfileMenu(false);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      backdrop: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      // Show loading state
      Swal.fire({
        title: 'Logging out...',
        html: 'Please wait while we sign you out securely.',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Wait a moment for visual feedback
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sign out without automatic redirect
        await signOut({ 
          redirect: false
        });

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Logged Out Successfully!',
          text: 'Redirecting to homepage...',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Manually redirect to homepage using window.location
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        
        // Close loading and show error
        await Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'An error occurred during logout. Redirecting...',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Fallback to manual redirect
        window.location.href = '/';
      }
    }
  };

  // Effects
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      // F11 for fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleToggleFullscreen]);

  return (
    <header className="sticky mt-9 top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 gap-4">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h2 className="text-lg font-bold text-gray-800">
              {currentPage}
            </h2>
            <p className="text-xs text-gray-500 hidden xl:block">
              Welcome back, {user.name.split(' ')[0]}!
            </p>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl ml-auto">
            <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                searchFocused ? 'text-black' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search... (Ctrl+K)"
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                         text-sm text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300
                         focus:bg-white transition-all duration-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Search Icon */}
          <button 
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group active:scale-95"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
          </button>

        

         

      


          {/* Fullscreen Toggle */}
          <button 
            onClick={handleToggleFullscreen}
            className="hidden lg:block p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group active:scale-95"
            aria-label="Toggle fullscreen"
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            ) : (
              <Maximize className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
            )}
          </button>

          {/* Messages Icon */}
          <MessageBell />

          {/* Live Chat Icon */}
          {/* <LiveChatAdmin /> */}

          {/* Notifications Icon */}
          <NotificationBell />

          {/* Divider */}
          <div className="hidden lg:block w-px h-8 bg-gray-200 mx-1"></div>

          {/* Profile Section */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 lg:pl-2 lg:pr-3 rounded-xl 
                       hover:bg-gray-50 transition-all duration-200 group active:scale-95"
              aria-label="User menu"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-sm ring-1 ring-gray-200 shadow-sm group-hover:ring-gray-300 transition-all">
                  {user.avatar}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white bg-gray-400">
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <ChevronDown className="hidden lg:block w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 
                          overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Profile Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold shadow-sm">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-black rounded-full">
                          {user.role}
                        </span>
                        {status === 'authenticated' && (
                          <span className={`w-2 h-2 rounded-full bg-gray-400`}></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details Section */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">User ID</span>
                      <span className="text-xs font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                        {session?.user?.id ? `${session.user.id.slice(0, 8)}...` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Role</span>
                      <span className="text-xs font-medium text-gray-800">{user.role}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Status</span>
                      <span className={`text-xs font-medium ${status === 'authenticated' ? 'text-black' : 'text-gray-600'}`}>
                        {status === 'authenticated' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full px-4 py-3 text-left flex items-center gap-3 
                                 hover:bg-gray-50 transition-all duration-150 group">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</p>
                      <p className="text-xs text-gray-500">View and edit profile</p>
                    </div>
                  </button>

                  <button className="w-full px-4 py-3 text-left flex items-center gap-3 
                                 hover:bg-gray-50 transition-all duration-150 group">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <Settings className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Settings</p>
                      <p className="text-xs text-gray-500">Manage preferences</p>
                    </div>
                  </button>

                  <button className="w-full px-4 py-3 text-left flex items-center gap-3 
                                 hover:bg-gray-50 transition-all duration-150 group">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <Activity className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Activity Log</p>
                      <p className="text-xs text-gray-500">Recent activities</p>
                    </div>
                  </button>

                  <button className="w-full px-4 py-3 text-left flex items-center gap-3 
                                 hover:bg-gray-50 transition-all duration-150 group">
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <Shield className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Security</p>
                      <p className="text-xs text-gray-500">Password & 2FA</p>
                    </div>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100 p-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 
                             hover:bg-gray-50 rounded-xl transition-all duration-150 group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <LogOut className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Logout</p>
                      <p className="text-xs text-gray-500">Sign out securely</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
