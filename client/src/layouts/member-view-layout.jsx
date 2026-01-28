/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";  
import Sidebar from '../components/member-panel-components/sidebar'


const MemberDashboardLayout = () => {
  return (
    <div className="bg-[#111111] min-h-screen">
      <div className="flex flex-col md:flex-row h-full">
        <Sidebar />
        <main className={`
    flex-1 md:h-screen h-[calc(100vh-4rem)] overflow-y-auto 
    lg:pt-5    /* large screens ke liye chhota padding */
    md:pt-16   /* tablets ke liye 80px padding */
    sm:pt-24   /* small screens ke liye 96px padding */
    pt-18     /* extra-small (mobile) screens ke liye 112px padding */
    pb-10 p-2
   
    
  `}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberDashboardLayout;