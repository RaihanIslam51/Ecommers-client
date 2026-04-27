import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageLoader from "@/components/PageLoader";
import { CartProvider } from "@/context/CartContext";
import SessionProvider from "./providers/SessionProvider";
import DataPrefetchProvider from "@/components/DataPrefetchProvider";


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
  metadataBase: new URL('https://BDmart.com'),
  title: "BDmart - Fashion & Clothing Store",
  description:
    "Discover the latest fashion trends, premium clothing, and stylish accessories at BDmart.com. Shop men's, women's, and kids' apparel — from casual wear to formal outfits — delivered fast to your doorstep.",
  keywords: [
    "fashion",
    "clothing",
    "men's fashion",
    "women's fashion",
    "kids clothing",
    "casual wear",
    "formal wear",
    "trendy outfits",
    "online clothing store",
    "affordable fashion",
    "apparel",
    "accessories",
    "BDmart",
    "fashion marketplace",
  ],
  authors: [{ name: "BDmart Team" }],
  creator: "BDmart",
  publisher: "BDmart",
  robots: "index, follow",
  openGraph: {
    title: "BDmart.com - Fashion & Clothing Store",
    description:
      "Shop the latest trends in men's, women's, and kids' fashion. Premium quality clothing and accessories delivered fast. Style made simple with BDmart.",
    url: "https://BDmart.com",
    siteName: "BDmart.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BDmart.com - Fashion & Clothing Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDmart.com - Fashion & Clothing Store",
    description: "Trendy clothing and accessories for men, women, and kids — delivered to your doorstep.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 font-sans`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <CartProvider>
            <DataPrefetchProvider>
              {/* ========== INITIAL PAGE LOADER ========== */}
              {/* <PageLoader /> */}

              {/* App Wrapper - Professional Layout Structure */}
              <div className="flex flex-col min-h-screen relative">
                {/* ========== NAVIGATION HEADER ========== */}
                <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
                  <Navbar />
                </header>

                {/* ========== MAIN CONTENT AREA ========== */}
                <main className="flex-1 pt-5 md:pt-26 w-full overflow-hidden">
                  {/* Content Container with Professional Spacing */}
                  <div className="w-full mx-auto">
                    {children}
                  </div>
                </main>

                {/* ========== FOOTER SECTION ========== */}
                <footer className="w-full text-white mx-auto">
                  <Footer />
                </footer>

                {/* ========== SCROLL TO TOP BUTTON (Optional Enhancement) ========== */}
                <div id="scroll-to-top-anchor" className="hidden"></div>
              </div>
            </DataPrefetchProvider>
          </CartProvider>
        </SessionProvider>

        {/* ========== GLOBAL ACCESSIBILITY & SEO ========== */}
        <noscript>
          <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-2 border-yellow-400 text-yellow-900 px-4 py-3 text-center text-sm font-medium z-100">
            Please enable JavaScript for the best experience on BDmart.com.
          </div>
        </noscript>
      </body>
    </html>
  );
}