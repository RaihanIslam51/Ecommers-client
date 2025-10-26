import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./compoents/Navbar/Navbar";
import Footer from "./compoents/Footer/Footer";
import PageLoader from "./components/PageLoader";
import { CartProvider } from "@/context/CartContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "BDMart - Global Wholesale & Retail Marketplace | Buy & Sell Online",
  description:
    "BDMart is Bangladesh's premier wholesale and retail marketplace connecting verified suppliers and buyers nationwide. Shop authentic products with competitive prices and reliable service.",
  keywords: [
    "wholesale marketplace",
    "bdmart",
    "ecommerce Bangladesh",
    "online shopping",
    "supplier directory",
    "retail marketplace",
    "wholesale products",
    "bulk buying",
    "B2B marketplace",
    "online retail",
  ],
  authors: [{ name: "BDMart Team" }],
  creator: "BDMart",
  publisher: "BDMart",
  robots: "index, follow",
  openGraph: {
    title: "BDMart - Global Wholesale & Retail Marketplace",
    description:
      "Buy and sell wholesale and retail products in Bangladesh with trust, transparency, and competitive pricing. Join thousands of verified suppliers and buyers.",
    url: "https://bdmart.com",
    siteName: "BDMart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BDMart - Your Trusted Marketplace",
      },
    ],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDMart - Global Wholesale & Retail Marketplace",
    description: "Buy and sell wholesale and retail products with confidence",
    images: ["/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 font-sans`}
      >
        <CartProvider>
          {/* ========== INITIAL PAGE LOADER ========== */}
          <PageLoader />

          {/* App Wrapper - Professional Layout Structure */}
          <div className="flex flex-col min-h-screen relative">

            {/* ========== NAVIGATION HEADER ========== */}
            <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
              <Navbar />
            </header>

            {/* ========== MAIN CONTENT AREA ========== */}
            <main className="flex-1 pt-[120px] md:pt-[140px] w-full">
              {/* Content Container with Professional Spacing */}
              <div className="w-full">
                {children}
              </div>
            </main>

            {/* ========== FOOTER SECTION ========== */}
            <footer className="w-full  text-white mt-auto">
              <Footer />
            </footer>

            {/* ========== SCROLL TO TOP BUTTON (Optional Enhancement) ========== */}
            <div id="scroll-to-top-anchor" className="hidden"></div>

          </div>
        </CartProvider>

        {/* ========== GLOBAL ACCESSIBILITY & SEO ========== */}
        <noscript>
          <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-2 border-yellow-400 text-yellow-900 px-4 py-3 text-center text-sm font-medium z-100">
            Please enable JavaScript for the best experience on BDMart.
          </div>
        </noscript>
      </body>
    </html>
  );
}
