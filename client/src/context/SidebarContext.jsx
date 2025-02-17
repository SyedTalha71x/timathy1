/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleRightSidebar = () => setIsRightSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsRightSidebarOpen(false);

  return (
    <SidebarContext.Provider value={{ isRightSidebarOpen, toggleRightSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
