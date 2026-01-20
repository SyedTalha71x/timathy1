/* eslint-disable no-unused-vars */
import React from "react";

const ActiveBanner = () => {
    return (
      <div className="w-auto max-w-7xl flex justify-center items-center rounded-2xl text-white h-full p-16 mx-auto bg-black md:shadow-box_shadow lg:translate-y-[-8rem] relative z-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-24 text-center">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold">500+</h2>
              <p className="text-sm text-gray-400">Active user</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default ActiveBanner
  
