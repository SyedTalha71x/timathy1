/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/customer-dashboard/sidebar'


const AdminDashboardLayout = () => {
  return (
    <div className="bg-[#111111] min-h-screen">
      <div className="flex flex-col md:flex-row h-full">
        <Sidebar />
        <main className="flex-1 md:h-screen h-[calc(100vh-4rem)] overflow-y-auto md:pt-5 pt-20 pb-10 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;