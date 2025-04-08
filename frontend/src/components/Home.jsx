import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow lg:ml-[16%] lg:mr-[300px]">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;