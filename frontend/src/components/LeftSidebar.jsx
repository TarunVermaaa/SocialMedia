import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { Icon: <LogOut />, text: "Logout" },
];

const LeftSidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    }
    if (textType === "Home") {
      navigate("/");
    }
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
      <div className="flex flex-col pt-4">
        <img
          className="w-40 -ml-1 mb-4 mt-8"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmW6Ork6idHNOFfvbmcXllJke67X87YdgtVQ&s"
          alt="logo"
        />
        <div>
          {sideBarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-lg my-1"
            >
              <span className="text-gray-600">{item.Icon}</span>
              <span className="text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;