import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./compoents/Navbar/Navbar";
import Footer from "./compoents/Footer/Footer";


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
  title: "BDMart | Smart Wholesale & Retail Marketplace",
  description:
    "BDMart is Bangladesh’s trusted wholesale and retail marketplace — connecting verified suppliers and buyers nationwide.",
  keywords: [
    "wholesale",
    "bdmart",
    "ecommerce",
    "Bangladesh marketplace",
    "supplier",
    "retail",
  ],
  authors: [{ name: "BDMart Team" }],
  openGraph: {
    title: "BDMart | Smart Wholesale & Retail Marketplace",
    description:
      "Buy and sell wholesale products in Bangladesh with trust and transparency.",
    url: "https://bdmart.com",
    siteName: "BDMart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BDMart Marketplace",
      },
    ],
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Main App Wrapper */}
        <div className="flex min-h-screen flex-col">
          {/* Navbar */}
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <Navbar></Navbar>
          </header>

          {/* Main Content Area */}
          <main className="flex-1  pt-[132px] md:pt-[140px]">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-auto">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
            <Footer></Footer>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
