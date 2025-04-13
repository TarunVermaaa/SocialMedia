import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification, commentNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();

  console.log("like notification:", likeNotification);
  console.log("comment Notification:", commentNotification);

  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const totalNotifications =
    likeNotification.length + commentNotification.length;

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    setActiveTab(textType);
    if (textType === "Logout") {
      logoutHandler();
    }
    if (textType === "Home") {
      navigate("/");
    }
    if (textType === "Create") {
      setOpen(!open);
    }
    if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    }
    if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sideBarItems = [
    { Icon: <Home />, text: "Home" },
    { Icon: <Search />, text: "Search" },
    { Icon: <TrendingUp />, text: "Explore" },
    { Icon: <MessageCircle />, text: "Messages" },
    { Icon: <Heart />, text: "Notifications" },
    { Icon: <PlusSquare />, text: "Create" },
    {
      Icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { Icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col pt-4">
        <img
          className="w-40 object-cover ml-4  "
          src="https://res.cloudinary.com/drnifvnkf/image/upload/v1744544999/ikhdpbwenz6mukljxf2r.jpg"
          alt="logo"
        />
        <div>
          {sideBarItems.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => {
                if (
                  item.text === "Notifications" &&
                  (likeNotification.length > 0 ||
                    commentNotification.length > 0)
                ) {
                  setNotificationOpen(!notificationOpen);
                } else {
                  sidebarHandler(item.text);
                }
              }}
              className="relative flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg my-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence>
                {activeTab === item.text && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <div className="relative">
                <motion.span
                  className={`text-gray-600 ${
                    activeTab === item.text ? "text-blue-500" : ""
                  }`}
                  animate={{
                    scale: activeTab === item.text ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.Icon}
                </motion.span>
                {item.text === "Notifications" &&
                  totalNotifications > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Popover
                        open={notificationOpen}
                        onOpenChange={setNotificationOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="rounded-full !h-4 !w-4 !bg-red-500 text-white text-xs font-bold flex items-center justify-center !p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotificationOpen(!notificationOpen);
                            }}
                          >
                            {totalNotifications}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg mb-2">
                              Notifications
                            </h3>
                            {totalNotifications === 0 ? (
                              <p className="text-gray-500">
                                No new notifications
                              </p>
                            ) : (
                              <>
                                {likeNotification.map((notification) => (
                                  <div
                                    key={`like-${notification.userId}-${notification.postId}`}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                      />
                                      <AvatarFallback>
                                        {notification.userDetails.username
                                          .charAt(0)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm">
                                      <span className="font-semibold">
                                        {notification.userDetails.username}{" "}
                                      </span>
                                      liked your post
                                    </p>
                                  </div>
                                ))}

                                {commentNotification.map((notification) => (
                                  <div
                                    key={`comment-${notification.userId}-${notification.commentId}`}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                      />
                                      <AvatarFallback>
                                        {notification.userDetails.username
                                          .charAt(0)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm">
                                      <span className="font-semibold">
                                        {notification.userDetails.username}{" "}
                                      </span>
                                      commented: "{notification.commentText}"
                                    </p>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
              </div>
              <motion.span
                className={`text-gray-700 ${
                  activeTab === item.text ? "text-blue-500 font-medium" : ""
                }`}
                animate={{
                  x: activeTab === item.text ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.text}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
