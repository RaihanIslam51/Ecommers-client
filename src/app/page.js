
import Banner from "./Home/Banner/Banner";
import Category from "./Home/Category/Category";
import Topsales from "./Home/TopSales/Topsales";
import Collection from "./Home/Collection/Collection";

export default function Home() {
  return (
 <div className="bg-linear-to-b from-gray-50 via-white to-gray-50 min-h-screen">
 <Banner></Banner>
 <Category></Category>
 <Topsales></Topsales>
 <Collection></Collection>
 </div>
  );
}
