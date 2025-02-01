/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const Dashboardlayout = () => {
  return (
    <div className="bg-[#111111] min-h-screen h-screen overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-auto md:pt-5 pt-20 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboardlayout;

