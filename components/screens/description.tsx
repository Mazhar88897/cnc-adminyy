import React from 'react';

const Description = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <h1 className="text-4xl  font-extrabold text-teal-500 mb-6">
          STRUGGLING WITH FEEDS AND SPEEDS?
        </h1>
        
        {/* Subheading */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-black mb-8">
          Take the guesswork out of CNC
        </h2>
        
        {/* Description text */}
        <div className="space-y-4 text-md text-black mb-12 max-w-3xl mx-auto">
          <p>
            Our <span className="font-bold">FREE</span> feeds and speeds app gives you machine-specific recommendations in seconds.
             Minimising broken bits, burnt wood, or wasted stock — confident cuts every time.
          </p>
         
        </div>
        
        {/* CTA Button */}
        <button className="bg-[#004851]  text-white font-semibold py-2 px-6 rounded-[20px] text-lg transition-colors duration-200 shadow-lg">
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Description;
