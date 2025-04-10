import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block fixed right-0 top-0 h-screen w-[300px] py-6 px-4 border-l border-gray-100">
      {/* Current User Profile */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <Link to={`/profile/${user?._id}`} className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={user?.profilePicture} 
              alt="profile" 
              className="rounded-full object-cover"
            />
            <AvatarFallback className="bg-gray-100 rounded-full">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 hover:underline">
              {user?.username}
            </h3>
            <span className="text-xs text-gray-500 line-clamp-1">
              {user?.bio || "No bio yet"}
            </span>
          </div>
        </Link>
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;