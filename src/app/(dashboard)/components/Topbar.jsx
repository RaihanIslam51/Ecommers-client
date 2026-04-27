'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import NotificationBell from '../dashboard/Components/NotificationBell';
import MessageBell from '../dashboard/Components/MessageBell';
import {
  Search,
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
  Maximize,
  Minimize,
  X,
  Activity,
  Shield,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   LANGUAGE OPTIONS  (logic unchanged)
───────────────────────────────────────────── */
const LANGUAGES = [
  { code: 'EN', name: 'English',  flag: '🇬🇧' },
  { code: 'BN', name: 'বাংলা',    flag: '🇧🇩' },
  { code: 'ES', name: 'Español',  flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'AR', name: 'العربية',  flag: '🇸🇦' },
];

/* ─────────────────────────────────────────────
   SMALL REUSABLE PIECES
───────────────────────────────────────────── */

/** Thin vertical divider for the right-side toolbar */
const Divider = () => (
  <div className="hidden lg:block w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
);

/** Ghost icon button — consistent sizing & hover for toolbar icons */
const ToolBtn = ({ children, onClick, title, className = '' }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95 text-gray-500 hover:text-gray-900 flex-shrink-0 ${className}`}
  >
    {children}
  </button>
);

/* ─────────────────────────────────────────────
   PROFILE DROPDOWN MENU ITEM
───────────────────────────────────────────── */
const DropdownItem = ({ icon: Icon, label, sub, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors group ${
      danger ? 'hover:bg-red-50' : ''
    }`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
      danger
        ? 'bg-red-50 group-hover:bg-red-100'
        : 'bg-gray-100 group-hover:bg-gray-200'
    }`}>
      <Icon className={`w-3.5 h-3.5 ${danger ? 'text-red-500' : 'text-gray-600 group-hover:text-gray-900'}`} />
    </div>
    <div className="text-left min-w-0">
      <p className={`text-sm font-medium leading-none mb-0.5 ${danger ? 'text-red-600' : 'text-gray-800 group-hover:text-gray-900'}`}>
        {label}
      </p>
      {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
    </div>
  </button>
);

/* ─────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────── */
const Topbar = ({ onMenuClick, currentPage = 'Dashboard' }) => {
  const router             = useRouter();
  const { data: session, status } = useSession();

  /* state */
  const [showProfileMenu,  setShowProfileMenu]  = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isDarkMode,       setIsDarkMode]       = useState(false);
  const [isFullscreen,     setIsFullscreen]     = useState(false);
  const [searchFocused,    setSearchFocused]    = useState(false);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [isOnline,         setIsOnline]         = useState(true);
  const [currentLanguage,  setCurrentLanguage]  = useState('EN');

  /* derived user */
  const user = {
    name:   session?.user?.name  || 'Admin User',
    email:  session?.user?.email || 'admin@bdmart.com',
    role:   session?.user?.role === 'admin' ? 'Administrator' : 'User',
    avatar: session?.user?.name
      ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'AU',
    status: 'online',
  };

  /* refs */
  const profileMenuRef  = useRef(null);
  const languageMenuRef = useRef(null);

  /* ── handlers (all logic unchanged) ── */
  const handleSearchChange  = (e) => setSearchQuery(e.target.value);
  const handleClearSearch   = ()  => setSearchQuery('');

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0a0a0a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      backdrop: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Logging out…',
        html: 'Please wait while we sign you out securely.',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await signOut({ redirect: false });
        await Swal.fire({ icon: 'success', title: 'Logged Out Successfully!', text: 'Redirecting…', timer: 1500, showConfirmButton: false });
        window.location.href = '/';
      } catch (error) {
        console.error('Logout error:', error);
        await Swal.fire({ icon: 'error', title: 'Logout Failed', text: 'Redirecting…', timer: 2000, showConfirmButton: false });
        window.location.href = '/';
      }
    }
  };

  /* ── effects (all logic unchanged) ── */
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current  && !profileMenuRef.current.contains(e.target))  setShowProfileMenu(false);
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target)) setShowLanguageMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      if (e.key === 'F11') { e.preventDefault(); handleToggleFullscreen(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleToggleFullscreen]);

  /* ──────────────────────────────────────────
     RENDER
  ────────────────────────────────────────── */
  return (
    <header className="sticky mt-9 top-0 z-40 w-full bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 gap-4">

        {/* ── LEFT: hamburger + page title ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuClick}
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95 text-gray-500 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="hidden md:block min-w-0">
            <h2 className="text-sm font-medium text-gray-900 truncate">{currentPage}</h2>
            <p className="text-xs text-gray-400 hidden xl:block">
              Welcome back, {user.name.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* ── CENTER: search bar ── */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
              searchFocused ? 'text-gray-700' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search…  ⌘K"
              className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
                         text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white
                         transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: toolbar + profile ── */}
        <div className="flex items-center gap-1">

          {/* Mobile search */}
          <ToolBtn className="md:hidden" aria-label="Search">
            <Search className="w-4 h-4" />
          </ToolBtn>

          {/* Fullscreen */}
          <ToolBtn
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
            className="hidden lg:flex"
          >
            {isFullscreen
              ? <Minimize className="w-4 h-4" />
              : <Maximize className="w-4 h-4" />}
          </ToolBtn>

          {/* Messages */}
          <MessageBell />

          {/* Notifications */}
          <NotificationBell />

          <Divider />

          {/* ── PROFILE ── */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(v => !v)}
              aria-label="User menu"
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors active:scale-95 group"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{user.avatar}</span>
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>

              {/* Name + role */}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.role}</p>
              </div>

              <ChevronDown className={`hidden lg:block w-3.5 h-3.5 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* ── PROFILE DROPDOWN ── */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">

                {/* Header */}
                <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-white">{user.avatar}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account details */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">Account</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">User ID</span>
                      <span className="text-xs font-mono text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                        {session?.user?.id ? `${session.user.id.slice(0, 8)}…` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Role</span>
                      <span className="text-xs font-medium text-gray-800">{user.role}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status</span>
                      <span className={`text-xs font-medium ${status === 'authenticated' ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {status === 'authenticated' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <DropdownItem icon={User}     label="My Profile" sub="View and edit profile" />
                  <DropdownItem icon={Settings} label="Settings"   sub="Manage preferences" />
                  <DropdownItem icon={Activity} label="Activity Log" sub="Recent activities" />
                  <DropdownItem icon={Shield}   label="Security"   sub="Password & 2FA" />
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 py-1">
                  <DropdownItem
                    icon={LogOut}
                    label="Logout"
                    sub="Sign out securely"
                    onClick={handleLogout}
                    danger
                  />
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