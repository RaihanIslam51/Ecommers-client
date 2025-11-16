
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
        <Category />
      </section>

      {/* Top Selling Products Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-white">
        <Topsales />
      </section>

      {/* Featured Collections Section */}
      <section className="w-full py-8 md:py-12 lg:py-16 bg-gray-50">
        <Collection />
      </section>

      {/* WhatsApp Float Button */}
      <Whatsapp />
    </div>
  );
}
