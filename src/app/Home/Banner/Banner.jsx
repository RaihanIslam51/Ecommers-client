import React from 'react';
import LeftBanner from './Components/RightBanner.jsx/LeftBanner';
import RightBanner from './Components/RightBanner.jsx/RightBanner';
import Support from './Components/RightBanner.jsx/Support';


const Banner = () => {
  return (
   <div>
     <div className="w-full flex flex-col md:flex-row md:h-96 h-50">
         {/* Right Banner - 3/4 width */}
      <div className="w-full md:w-3/4">
        <RightBanner/>
      </div>
      {/* Left Banner - 1/4 width */}
       <div className="hidden md:block md:w-1/4">
         <LeftBanner />
       </div>
       
     
    </div>
    <div>
      <Support></Support>
    </div>
   </div>
  );
};

export default Banner;
