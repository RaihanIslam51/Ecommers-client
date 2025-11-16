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
  title: "RannerKaj.com - Fresh Vegetables, Healthy Foods & Ready-to-Cook Meal Kits",
  description:
    "Discover fresh, organic vegetables, healthy food items, and ready-to-cook meal packages at KannerKaj.com. Hygienically prepared meal kits, pre-cut vegetables, and healthy food combos delivered fresh to your doorstep.",
  keywords: [
    "fresh vegetables",
    "organic food",
    "meal kits",
    "ready to cook",
    "healthy food",
    "pre-cut vegetables",
    "meal packages",
    "organic produce",
    "fresh food delivery",
    "healthy eating",
    "vegetable delivery",
    "meal prep",
    "RannerKaj",
    "fresh food marketplace",
  ],
  authors: [{ name: "RannerKaj Team" }],
  creator: "RannerKaj",
  publisher: "RannerKaj",
  robots: "index, follow",
  openGraph: {
    title: "RannerKaj.com - Fresh Vegetables & Healthy Meal Kits",
    description:
      "Get fresh, organic vegetables, ready-to-cook meal packages, and healthy food combos delivered fresh. Make healthy cooking easy with hygienically prepared meal kits.",
    url: "https://Rannerkaj.com",
    siteName: "RannerKaj.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RannerKaj.com - Fresh & Healthy Foods",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RannerKaj.com - Fresh Vegetables & Healthy Meal Kits",
    description: "Fresh, organic vegetables and ready-to-cook meal packages delivered to your doorstep",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-green-50 text-gray-900 font-sans`}
      >
        <SessionProvider>
          <CartProvider>
            <DataPrefetchProvider>
              {/* ========== INITIAL PAGE LOADER ========== */}
              <PageLoader />

              {/* App Wrapper - Professional Layout Structure */}
              <div className="flex flex-col min-h-screen relative">
                {/* ========== NAVIGATION HEADER ========== */}
                <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-sm">
                  <Navbar />
                </header>

                {/* ========== MAIN CONTENT AREA ========== */}
                <main className="flex-1 pt-[120px] md:pt-[140px] w-full overflow-hidden">
                  {/* Content Container with Professional Spacing */}
                  <div className="w-full  mx-auto ">
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
            Please enable JavaScript for the best experience on RannerKaj.com.
          </div>
        </noscript>
      </body>
    </html>
  );
}
