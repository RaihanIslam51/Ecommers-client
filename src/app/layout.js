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
        {/* App Wrapper */}
        <div className="flex flex-col min-h-screen">

          {/* Navbar */}
          <header className=" w-full bg-white shadow-sm">
            <Navbar />
          </header>

         {/* Main Content */}
       <main className="flex-1 pt-18 md:pt-[140px] w-full">
         <div className=" mx-auto sm:px-6 lg:px-8">
          {children}
         </div>
        </main>


          {/* Footer */}
          <footer className=" w-full shadow-sm mt-auto">
            <div className=" mx-auto">
              <Footer />
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}
