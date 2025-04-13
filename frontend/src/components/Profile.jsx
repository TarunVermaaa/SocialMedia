import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Grid3x3, LayoutGrid, MessageCircle, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const isLoggedInUser = user?._id === userProfile?._id;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  // Function to refresh user profile data
  const refreshUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/${userId}/profile`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
      }
    } catch (error) {
      console.log("Error refreshing profile:", error);
    }
  };

  const followHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setIsFollowing(!isFollowing);
        // Refresh user profile data using the separate function
        refreshUserProfile();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto mt-8 px-4 ${
        activeTab === "posts" ? "-ml-15" : ""
      }   `}
    >
      {/* Profile Header */}
      <div className="flex items-center gap-8">
        <Avatar className="w-24 h-24 border-2 border-gray-200">
          <AvatarImage
            src={userProfile?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl font-medium">
            {userProfile?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-2xl font-light">{userProfile?.username}</h1>
            {isLoggedInUser ? (
              <>
                <Link to="/account/edit">
                  <Button
                    variant="secondary"
                    className="!bg-white text-black px-4 mt-3 !py-2 rounded-lg"
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="!px-4 !py-1.5 !bg-white !text-black  mt-3  rounded-lg"
                >
                  View Archive
                </Button>
              </>
            ) : isFollowing ? (
              <>
                <Button
                  variant="secondary"
                  className="!bg-gray-100 text-black  mt-4 !py-2 rounded-lg"
                  onClick={followHandler}
                >
                  Unfollow
                </Button>
                <Button
                  variant="secondary"
                  className="!bg-white text-black px-4  mt-4 !py-2 rounded-lg"
                >
                  Message
                </Button>
              </>
            ) : (
              <Button
                className="!bg-[#0095F6] text-white px-4  mt-4 !py-2 rounded-lg"
                onClick={followHandler}
              >
                Follow
              </Button>
            )}
          </div>

          <div className="flex gap-8 mb-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {userProfile?.posts?.length || 0}
              </span>
              <span className="text-gray-600 ">posts</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {userProfile?.followers?.length || 0}
              </span>
              <span className="text-gray-600">followers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">
                {userProfile?.following?.length || 0}
              </span>
              <span className="text-gray-600">following</span>
            </div>
          </div>

          <div>
            <Badge
              variant="outline"
              className="!bg-gray-100 !text-gray-800 w-fit "
            >
              {userProfile?.username}
            </Badge>
            <p className="text-gray-800">{userProfile?.bio || "No bio yet"}</p>
          </div>
        </div>
      </div>

      {/* Posts Navigation */}
      <div className="border-t border-gray-200 mt-8">
        <div className="flex items-center justify-center gap-16">
          <Button
            onClick={() => handleTabChange("posts")}
            variant="ghost"
            className={`flex items-center gap-2 py-8 !bg-white !border-none  text-gray-600 ${
              activeTab === "posts" ? "!font-bold text-black " : ""
            } `}
          >
            <Grid3x3 className="w-5 h-5" />
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                activeTab === "posts" ? "!font-bold text-black " : ""
              } `}
            >
              POSTS
            </span>
          </Button>
          <Button
            onClick={() => handleTabChange("saved")}
            variant="ghost"
            className={`flex items-center gap-2 py-8 !bg-white !border-none text-gray-600 ${
              activeTab === "saved" ? "!font-bold text-black " : ""
            } `}
          >
            <LayoutGrid className="w-5 h-5" />
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                activeTab === "saved" ? "!font-bold text-black " : ""
              } `}
            >
              SAVED
            </span>
          </Button>
        </div>
      </div>

      {/* Posts Grid with Framer Motion */}
      <div className="min-h-[400px]">
        <motion.div
          className="grid grid-cols-3 gap-1 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {displayedPost?.length > 0 ? (
            displayedPost.map((post) => (
              <motion.div
                key={post._id}
                className="group relative aspect-square cursor-pointer"
                initial={{ opacity: 0, y: -20 }} // 👈 upar se aaye
                animate={{ opacity: 1, y: 0 }} // 👈 neeche aaye smoothly
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <img
                  src={post.image}
                  alt={`Post ${post._id}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 ">
                  <div className="flex items-center gap-4 text-white">
                    <span className="flex items-center gap-1">
                      <Heart className="w-5 h-5" /> {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />{" "}
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No {activeTab} yet</p>
              <p className="text-sm">
                When you have {activeTab}, they'll appear here
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
