"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaHome,
  FaHeart,
  FaUser,
  FaTag,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

// ==================== CONSTANTS ====================
const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About KannerKaj", href: "/about" },
  { label: "Our Story", href: "/story" },
  { label: "Quality Standards", href: "/quality" },
  { label: "Store Locations", href: "/locations" },
  { label: "Contact Us", href: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "Track Your Order", href: "/track" },
  { label: "Freshness Guarantee", href: "/freshness" },
  { label: "Delivery Info", href: "/delivery" },
  { label: "Privacy Policy", href: "/privacy" },
];

const MOBILE_NAV_ITEMS = [
  { icon: FaHome, label: "Home", href: "/" },
  { icon: FaTag, label: "Offers", href: "/offers" },
  { icon: FaUser, label: "Account", href: "/profile" },
  { icon: FaHeart, label: "Wishlist", href: "/wishlist" },
];

const CONTACT_INFO = {
  email: "support@kannerkaj.com",
  phone: "+880 013095-40406",
  address: {
    building: "House No: 540, 4th Floor",
    street: "I Block , 1 No Road",
    city: "Basundhara R/A, Dhaka-1207",
    country: "Bangladesh",
  },
  officePhones: [ "+880 0130954 0406"],
};

// ==================== COMPONENTS ====================

/**
 * Newsletter subscription form component
 */
const NewsletterForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
  };

  return (
    <div>
      <h4 className="text-xs font-bold text-green-400 mb-3 uppercase tracking-widest">
        Stay Fresh
      </h4>
      <form onSubmit={handleSubmit} aria-label="Subscribe to newsletter">
        <label htmlFor="newsletter" className="sr-only">
          Email address
        </label>
        <div className="relative w-full">
          <input
            id="newsletter"
            type="email"
            placeholder="Get fresh updates & recipes"
            required
            className="w-full py-2.5 px-4 bg-gray-900 text-white placeholder-gray-500 text-sm border border-gray-800 focus:border-green-500 focus:outline-none transition-colors rounded-l-md"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-r-md transition-colors duration-200"
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Contact information display component
 */
const ContactInfo = () => (
  <div className="text-sm text-gray-400 space-y-2">
    <div className="flex items-center gap-2">
      <FaEnvelope className="text-green-500 shrink-0" size={14} />
      <a
        href={`mailto:${CONTACT_INFO.email}`}
        className="hover:text-green-400 transition-colors duration-200"
      >
        {CONTACT_INFO.email}
      </a>
    </div>
    <div className="flex items-center gap-2">
      <FaPhone className="text-green-500 shrink-0" size={14} />
      <a
        href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
        className="hover:text-green-400 transition-colors duration-200"
      >
        {CONTACT_INFO.phone}
      </a>
    </div>
  </div>
);

/**
 * Reusable footer section component with title and links
 */
const FooterSection = ({ title, links }) => (
  <div>
    <h3 className="text-xs font-bold mb-5 text-green-400 uppercase tracking-widest">
      {title}
    </h3>
    <ul className="space-y-3 text-sm">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-gray-400 hover:text-green-400 transition-colors duration-200"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Office address and phone numbers component
 */
const OfficeInfo = () => (
  <div>
    <h3 className="text-xs font-bold mb-5 text-green-400 uppercase tracking-widest">
      Head Office
    </h3>
    <address className="not-italic text-sm text-gray-400 leading-relaxed space-y-3">
      <p>
        {CONTACT_INFO.address.building}
        <br />
        {CONTACT_INFO.address.street}
        <br />
        {CONTACT_INFO.address.city}
        <br />
        {CONTACT_INFO.address.country}
      </p>
      <div className="space-y-1 pt-2">
        {CONTACT_INFO.officePhones.map((phone) => (
          <div key={phone}>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hover:text-green-400 transition-colors duration-200"
            >
              {phone}
            </a>
          </div>
        ))}
      </div>
    </address>
  </div>
);

/**
 * Social media links component
 */
const SocialLinks = () => (
  <div className="flex items-center gap-3">
    {SOCIAL_LINKS.map((social) => {
      const Icon = social.icon;
      return (
        <a
          key={social.label}
          href={social.href}
          className="w-8 h-8 rounded-full bg-gray-900 hover:bg-green-600 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
          aria-label={social.label}
        >
          <Icon size={14} />
        </a>
      );
    })}
  </div>
);

/**
 * Payment methods display component
 */
const PaymentMethods = () => (
  <div className="flex items-center gap-4">
    <span className="text-xs text-gray-600">Secure Payment:</span>
    <div className="flex items-center gap-2 text-2xl text-gray-600">
      <FaCcVisa
        className="hover:text-green-400 transition-colors duration-200"
        aria-label="Visa"
      />
      <FaCcMastercard
        className="hover:text-green-400 transition-colors duration-200"
        aria-label="Mastercard"
      />
      <FaCcPaypal
        className="hover:text-green-400 transition-colors duration-200"
        aria-label="PayPal"
      />
    </div>
  </div>
);

/**
 * Mobile navigation item component
 */
const MobileNavItem = ({ icon: Icon, label, href }) => (
  <Link
    href={href}
    className="flex flex-col items-center justify-center text-xs text-gray-600 hover:text-green-600 transition-colors duration-200 flex-1 h-full active:bg-green-50"
  >
    <Icon size={18} />
    <span className="mt-1.5 font-medium text-[10px]">{label}</span>
  </Link>
);

/**
 * Brand and newsletter section component
 */
const BrandSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black mb-3 tracking-tight text-green-400">KannerKaj</h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        Your trusted source for fresh, organic vegetables, healthy food items, and ready-to-cook meal packages. 
        Quality guaranteed, hygienically prepared, and delivered fresh to your doorstep.
      </p>
    </div>
    <NewsletterForm />
    <ContactInfo />
  </div>
);

/**
 * Desktop footer content component
 */
const DesktopFooter = () => (
  <div className="hidden md:block">
    {/* Main Footer Content */}
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="400px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          <BrandSection />
          <FooterSection title="Company" links={COMPANY_LINKS} />
          <FooterSection title="Support" links={SUPPORT_LINKS} />
          <OfficeInfo />
        </div>
      </div>
    </div>

    {/* Footer Bottom Bar */}
    <div className="bg-gray-950 border-t border-gray-900">
      <div className="w-full mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-sm text-gray-500">
            <span>© {new Date().getFullYear()} KannerKaj.com. All rights reserved.</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <SocialLinks />
            <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Mobile bottom navigation bar component
 */
const MobileNavigation = () => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-50 shadow-xl">
    <div className="flex justify-around items-center h-16">
      {MOBILE_NAV_ITEMS.map((item) => (
        <MobileNavItem key={item.label} {...item} />
      ))}
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================

/**
 * Main Footer component
 * Displays desktop footer with company info and mobile bottom navigation
 * Hidden on dashboard pages
 */
const Footer = () => {
  const pathname = usePathname();

  // Don't render footer on dashboard pages
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <DesktopFooter />
      <MobileNavigation />
    </footer>
  );
};

export default Footer;
