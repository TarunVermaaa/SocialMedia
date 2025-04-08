import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      <div className="flex-1 ml-[90%]"> {/* Shifted to right since sidebar is fixed */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
