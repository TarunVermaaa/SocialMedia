import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((state) => state.auth);

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-gray-500 font-semibold text-sm">Suggested for you</h2>
        <span className="text-sm font-medium cursor-pointer text-[#0095F6] hover:text-[#0064B1]">
          See all
        </span>
      </div>

      {suggestedUsers.map(user => (
        <div key={user._id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={user?.profilePicture} 
                  alt="profile" 
                  className="rounded-full w-10 h-10 object-cover"
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
          <button className="!text-sm !bg-white text-[#0095F6] !border-none hover:text-[#0064B1] font-semibold">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;