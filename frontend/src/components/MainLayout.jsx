import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      <div>
        <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
    </div>
  );
};

export default MainLayout;
