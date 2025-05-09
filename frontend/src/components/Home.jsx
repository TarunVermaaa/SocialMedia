import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
const Home = () => {
  useGetAllPost()
  useGetSuggestedUsers()
  return (
    <div className="flex min-h-screen">
      <div className="flex-grow lg:ml-[16%] lg:mr-[100px]">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;