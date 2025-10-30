
import Banner from "./Home/Banner/Banner";
import Category from "./Home/Category/Category";
import Topsales from "./Home/TopSales/Topsales";
import Collection from "./Home/Collection/Collection";
import Whatsapp from "./compoents/Whatsapp/whatsapp";

export default function Home() {
  return (
    <div className="bg-linear-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Hero Banner Section */}
      <section className="w-full">
        <Banner />
      </section>

      {/* Category Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
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
