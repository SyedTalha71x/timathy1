/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const Dashboardlayout = () => {
  return (
    <div className="bg-[#111111] min-h-screen">
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-1 p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};



export default Dashboardlayout;
