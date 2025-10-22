import React from 'react';
import LeftBanner from './Components/RightBanner.jsx/LeftBanner';
import RightBanner from './Components/RightBanner.jsx/RightBanner';


const Banner = () => {
  return (
    <div className="w-full flex flex-col md:flex-row md:h-96 h-50 bg-red-500">
         {/* Right Banner - 3/4 width */}
      <div className="w-full md:w-3/4">
        <RightBanner/>
      </div>
      {/* Left Banner - 1/4 width */}
       <div className="hidden md:block md:w-1/4">
         <LeftBanner />
       </div>

     
    </div>
  );
};

export default Banner;
