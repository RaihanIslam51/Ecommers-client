'use client';

/**
 * Topbar Component - Enterprise E-commerce Dashboard
 * 
 * A professional, feature-rich topbar component designed for large-scale e-commerce platforms.
 * Includes notifications, search, user profile, multi-language support, and real-time updates.
 * 
 * @component
 * @version 2.0.0
 * @author BDMart Development Team
 * @license MIT
 */

// React Core
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Custom Components
import NotificationBell from '../dashboard/Components/NotificationBell';
import MessageBell from '../dashboard/Components/MessageBell';

// Lucide React Icons - UI Elements
import { 
  Bell,                  // Notification bell icon
  Search,                // Search functionality icon
  Menu,                  // Mobile menu toggle
  ChevronDown,           // Dropdown indicators
  Settings,              // Settings menu icon
  User,                  // User profile icon
  LogOut,                // Logout action icon
  Mail,                  // Messages/email icon
  Moon,                  // Dark mode icon
  Sun,                   // Light mode icon
  Maximize,              // Fullscreen toggle
  Globe,                 // Language selector
  HelpCircle,            // Help & support icon
  X,                     // Close/clear icon
  Clock,                 // Time/timestamp icon
  CheckCircle,           // Success notification icon
  AlertCircle,           // Warning/alert icon
  Package,               // Orders icon
  ShoppingCart,          // Cart icon
  TrendingUp,            // Analytics icon
  DollarSign,            // Payment icon
  Users,                 // Customers icon
  Activity,              // Activity/stats icon
  Download,              // Download/export icon
  Upload,                // Upload/import icon
  FileText,              // Documents icon
  BarChart3,             // Reports icon
  Zap,                   // Quick actions icon
  Star,                  // Favorites/ratings
  Shield,                // Security icon
  Database,              // Database/inventory icon
  Smartphone,            // Mobile/responsive icon
  Wifi,                  // Connection status
  WifiOff,               // Offline status
  RefreshCw,             // Refresh/reload icon
  Filter,                // Filter options
  SlidersHorizontal,     // Advanced settings
  Bookmark,              // Saved items
  Tag,                   // Tags/categories
  Calendar,              // Calendar/schedule
  CreditCard,            // Payment methods
  Truck,                 // Shipping/delivery
  MapPin,                // Location icon
  Image,                 // Media/images
  Video,                 // Video content
  Headphones,            // Support/customer service
  MessageSquare,         // Chat/messaging
  Send,                  // Send message
  Eye,                   // View/visibility
  EyeOff,                // Hide/privacy
  Lock,                  // Security/locked
  Unlock,                // Unlocked state
  Key,                   // API/access keys
  Link,                  // Links/URLs
  Copy,                  // Copy to clipboard
  ExternalLink,          // External links
  Maximize2,             // Expand icon
  Minimize2,             // Collapse icon
  MoreVertical,          // More options (vertical)
  MoreHorizontal,        // More options (horizontal)
  ChevronLeft,           // Navigation left
  ChevronRight,          // Navigation right
  ChevronUp,             // Navigation up
  ArrowUp,               // Sort/move up
  ArrowDown,             // Sort/move down
  Plus,                  // Add new item
  Minus,                 // Remove item
  Edit,                  // Edit action
  Trash2,                // Delete action
  Save,                  // Save action
  Check,                 // Confirm/complete
  AlertTriangle,         // Warning triangle
  Info,                  // Information icon
  XCircle,               // Error/close circle
} from 'lucide-react';

// Type Definitions (for TypeScript migration readiness)
/**
 * @typedef {Object} Notification
 * @property {number} id - Unique notification identifier
 * @property {string} text - Notification message content
 * @property {string} time - Time of notification
 * @property {boolean} unread - Read/unread status
 * @property {string} type - Notification type (success, warning, info, error)
 * @property {React.Component} icon - Icon component for notification
 */

/**
 * @typedef {Object} TopbarProps
 * @property {Function} onMenuClick - Callback for mobile menu toggle
 * @property {string} [currentPage] - Current active page name
 * @property {Object} [user] - User data object
 * @property {Function} [onLogout] - Logout callback function
 * @property {Function} [onSearch] - Search callback function
 * @property {boolean} [showSearch] - Toggle search visibility
 * @property {boolean} [showNotifications] - Toggle notifications visibility
 * @property {Array} [customNotifications] - Custom notifications array
 */


// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Notification types configuration
 */
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
  ERROR: 'error',
};

/**
 * User roles configuration
 */
const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  SUPPORT: 'Support',
};

/**
 * Supported languages
 */
const LANGUAGES = [
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'BD', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'AR', name: 'العربية', flag: '🇸🇦' },
  { code: 'ZH', name: '中文', flag: '🇨🇳' },
  { code: 'JA', name: '日本語', flag: '🇯🇵' },
];

/**
 * Quick action shortcuts
 */
const QUICK_ACTIONS = [
  { id: 'new-order', label: 'New Order', icon: Plus, shortcut: 'Ctrl+N' },
  { id: 'reports', label: 'Reports', icon: BarChart3, shortcut: 'Ctrl+R' },
  { id: 'inventory', label: 'Inventory', icon: Database, shortcut: 'Ctrl+I' },
  { id: 'customers', label: 'Customers', icon: Users, shortcut: 'Ctrl+U' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Topbar Component
 * 
 * Professional dashboard topbar for enterprise e-commerce platforms
 * Features: notifications, search, user profile, multi-language, dark mode
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMenuClick - Mobile menu toggle handler
 * @param {string} props.currentPage - Current active page name
 * @param {Object} props.user - User data object
 * @returns {JSX.Element} Topbar component
 */
const Topbar = ({ 
  onMenuClick, 
  currentPage = 'Dashboard',
  user = {
    name: 'Raihan Islam',
    email: 'raihan@bdmart.com',
    role: USER_ROLES.SUPER_ADMIN,
    avatar: 'RI',
    status: 'online'
  }
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  
  // Refs for click outside detection
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // ============================================================================
  // MOCK DATA (Replace with API calls in production)
  // ============================================================================
  
  const notifications = useMemo(() => [
    { 
      id: 1, 
      text: 'New order #12345 received from John Doe', 
      time: '2 min ago', 
      unread: true,
      type: NOTIFICATION_TYPES.SUCCESS,
      icon: CheckCircle,
      action: '/orders/12345'
    },
    { 
      id: 2, 
      text: 'Product "iPhone 15 Pro" stock running low (5 units left)', 
      time: '15 min ago', 
      unread: true,
      type: NOTIFICATION_TYPES.WARNING,
      icon: AlertCircle,
      action: '/inventory'
    },
    { 
      id: 3, 
      text: 'New customer registered: Sarah Johnson', 
      time: '1 hour ago', 
      unread: false,
      type: NOTIFICATION_TYPES.INFO,
      icon: User,
      action: '/customers'
    },
    { 
      id: 4, 
      text: 'Payment of $2,499.99 processed successfully', 
      time: '2 hours ago', 
      unread: false,
      type: NOTIFICATION_TYPES.SUCCESS,
      icon: DollarSign,
      action: '/payments'
    },
    { 
      id: 5, 
      text: 'Shipment #SH-8392 delivered to customer', 
      time: '3 hours ago', 
      unread: false,
      type: NOTIFICATION_TYPES.SUCCESS,
      icon: Truck,
      action: '/shipments/8392'
    },
  ], []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const unreadCount = useMemo(() => 
    notifications.filter(n => n.unread).length, 
    [notifications]
  );

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Get notification color based on type
   */
  const getNotificationColor = useCallback((type) => {
    const colorMap = {
      [NOTIFICATION_TYPES.SUCCESS]: 'text-green-600',
      [NOTIFICATION_TYPES.WARNING]: 'text-orange-600',
      [NOTIFICATION_TYPES.INFO]: 'text-blue-600',
      [NOTIFICATION_TYPES.ERROR]: 'text-red-600',
    };
    return colorMap[type] || 'text-gray-600';
  }, []);

  /**
   * Get notification background color based on type
   */
  const getNotificationBgColor = useCallback((type) => {
    const bgColorMap = {
      [NOTIFICATION_TYPES.SUCCESS]: 'bg-green-100',
      [NOTIFICATION_TYPES.WARNING]: 'bg-orange-100',
      [NOTIFICATION_TYPES.INFO]: 'bg-blue-100',
      [NOTIFICATION_TYPES.ERROR]: 'bg-red-100',
    };
    return bgColorMap[type] || 'bg-gray-100';
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement debounced search API call
  }, []);

  /**
   * Clear search query
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Toggle dark mode
   */
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
    // TODO: Persist to localStorage and apply theme
  }, []);

  /**
   * Toggle fullscreen mode
   */
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const handleMarkAllAsRead = useCallback(() => {
    // TODO: API call to mark all notifications as read
    console.log('Marking all notifications as read');
  }, []);

  /**
   * Handle notification click
   */
  const handleNotificationClick = useCallback((notification) => {
    // TODO: Navigate to notification action URL
    console.log('Notification clicked:', notification);
    setShowNotifications(false);
  }, []);

  /**
   * Handle language change
   */
  const handleLanguageChange = useCallback((langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
    // TODO: Implement i18n language change
  }, []);

  /**
   * Handle logout
   */
  const handleLogout = useCallback(() => {
    // TODO: Implement logout logic
    console.log('Logging out...');
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Handle online/offline status
   */
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

  /**
   * Close dropdowns when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Global search shortcut (Ctrl+K or Cmd+K)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        
        {/* ===== LEFT SECTION ===== */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95 touch-manipulation"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Breadcrumb / Page Title */}
          <div className="hidden md:block">
            <h2 className="text-base sm:text-lg font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {currentPage}
            </h2>
            <p className="text-xs text-gray-500 hidden xl:block">Welcome back, {user.name.split(' ')[0]}!</p>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xl ml-auto">
            <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                searchFocused ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products, orders, customers... (Ctrl+K)"
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                         text-sm text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
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

        {/* ===== RIGHT SECTION ===== */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Mobile Search Icon */}
          <button 
            className="md:hidden p-2 sm:p-2.5 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95 touch-manipulation"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Quick Actions - Desktop Only */}
          <div className="hidden xl:flex items-center gap-1 mr-1 sm:mr-2">
            <button 
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95"
              aria-label="Help Center"
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors hidden 2xl:inline">Help</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{currentLanguage}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            {/* Language Dropdown */}
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="py-2 max-h-80 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                        currentLanguage === lang.code ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <Check className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Connection Status Indicator */}
          <div className="hidden lg:block" title={isOnline ? 'Connected' : 'Offline'}>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={handleToggleDarkMode}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group relative active:scale-95 touch-manipulation"
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="relative">
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 group-hover:-rotate-12 transition-all duration-300" />
              )}
            </div>
          </button>

          {/* Fullscreen Toggle */}
          <button 
            onClick={handleToggleFullscreen}
            className="hidden lg:block p-2 sm:p-2.5 rounded-xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95"
            aria-label="Toggle fullscreen"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          {/* Messages - WhatsApp Style Component */}
          <MessageBell />

          {/* Notifications - New Real-time Component */}
          <NotificationBell />

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 sm:h-8 bg-gray-200 mx-0.5 sm:mx-1"></div>

          {/* Profile Section */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
                setShowLanguageMenu(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 p-1 sm:p-1.5 lg:pl-2 lg:pr-3 rounded-xl 
                       hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group active:scale-95 touch-manipulation"
              aria-label="User menu"
              title="User Profile Menu"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 
                              flex items-center justify-center text-white font-bold text-xs sm:text-sm
                              ring-2 ring-blue-100 shadow-md group-hover:ring-blue-200 transition-all">
                  {user.avatar}
                </div>
                <span className={`absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full 
                               ring-2 ring-white ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                  {user.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.role}</p>
              </div>
              <ChevronDown className="hidden lg:block w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 
                                    group-hover:text-blue-600 transition-colors shrink-0" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 sm:mt-3 w-[calc(100vw-2rem)] sm:w-64 max-w-xs bg-white rounded-2xl shadow-2xl border border-gray-200 
                            animate-in fade-in slide-in-from-top-5 duration-200 z-40 overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-3 sm:p-4 border-b border-gray-100 bg-linear-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 
                                    flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{user.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  <div className="py-2">
                    <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2.5 sm:gap-3 
                                   hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 group active:bg-blue-100">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors shrink-0">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">View and edit profile</p>
                      </div>
                    </button>

                    <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2.5 sm:gap-3 
                                   hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 group active:bg-blue-100">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors shrink-0">
                        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900">Settings</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Manage preferences</p>
                      </div>
                    </button>

                    <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2.5 sm:gap-3 
                                   hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 group active:bg-blue-100">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors shrink-0">
                        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900">Activity Log</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Recent activities</p>
                      </div>
                    </button>

                    <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2.5 sm:gap-3 
                                   hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 group active:bg-blue-100">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors shrink-0">
                        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900">Security</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">Password & 2FA</p>
                      </div>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-100 p-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-2.5 sm:gap-3 
                                   hover:bg-red-50 rounded-xl transition-all duration-150 group active:bg-red-100"
                    >
                      <div className="p-1.5 sm:p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors shrink-0">
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-red-600">Logout</p>
                        <p className="text-[10px] sm:text-xs text-red-400">Sign out securely</p>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* End of flex container */}
    </header>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default Topbar;

// Named exports for testing and component composition
export { NOTIFICATION_TYPES, USER_ROLES, LANGUAGES, QUICK_ACTIONS };
