import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import gsap from "gsap";
import axios from "axios";
import { toast } from "sonner";
import { setSuggestedUsers } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (showSuggestions && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [showSuggestions]);

  const followHandler = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Update the suggested users list in Redux
        const updatedUsers = suggestedUsers.map((suggestedUser) => {
          if (suggestedUser._id === userId) {
            // Toggle the following status
            const isFollowing = suggestedUser.followers?.includes(user?._id);
            return {
              ...suggestedUser,
              followers: isFollowing
                ? suggestedUser.followers.filter((id) => id !== user?._id)
                : [...(suggestedUser.followers || []), user?._id],
            };
          }
          return suggestedUser;
        });

        dispatch(setSuggestedUsers(updatedUsers));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-gray-500 font-semibold text-sm">
          Suggested for you
        </h2>
        <span
          onClick={() => setShowSuggestions(true)}
          className="text-sm font-medium cursor-pointer text-[#0095F6] hover:text-[#0064B1]"
        >
          See all
        </span>
      </div>

      {showSuggestions && (
        <div ref={containerRef}>
          {suggestedUsers.map((suggestedUser) => {
            const isFollowing = suggestedUser.followers?.includes(user?._id);

            return (
              <div
                key={suggestedUser._id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Link
                    to={`/profile/${suggestedUser?._id}`}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={suggestedUser?.profilePicture}
                        alt="profile"
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 rounded-full">
                        {suggestedUser?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 hover:underline">
                        {suggestedUser?.username}
                      </h3>
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {suggestedUser?.bio || "No bio yet"}
                      </span>
                    </div>
                  </Link>
                </div>
                <button
                  onClick={() => followHandler(suggestedUser?._id)}
                  className={`!text-sm !bg-white ${
                    isFollowing
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-[#0095F6] hover:text-[#0064B1]"
                  } !border-none font-semibold`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
