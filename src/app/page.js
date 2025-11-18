import { Suspense } from "react";
import Banner from "@/components/Home/Banner/Banner";
import Category from "@/components/Home/Category/Category";
import Topsales from "@/components/Home/TopSales/Topsales";
import Collection from "@/components/Home/Collection/Collection";
import Whatsapp from "@/components/Whatsapp/whatsapp";

export default function Home() {
  return (
    <div className="bg-linear-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Hero Banner Section */}
      <section className="w-full">
        <Banner />
      </section>

      {/* Category Section */}
      <section id="categories" className="w-full py-2 md:py-4 lg:py-6">
        <Suspense fallback={<div>Loading categories...</div>}>
          <Category />
        </Suspense>
      </section>

      {/* Top Selling Products Section */}
      <section className="w-full py-3 md:py-5 lg:py-6 bg-white">
        <Topsales />
      </section>

      {/* Featured Collections Section */}
      <section className="w-full py-2 md:py-3 lg:py-4">
        <Collection />
      </section>

      {/* WhatsApp Float Button */}
      <Whatsapp />
    </div>
  );
}
