import {
  Heart,
  Home,
  Icon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
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
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.get(" http://localhost:8000/api/v1/user/logout", {withCredentials: true});
      if( res.data.success) {
        navigate("/login")
        toast.success(res.data.message)
      }
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(error.response.data.message);
    }
  }


  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler()
    }
    if (textType === "Home") {
      navigate("/")
    }
  }

  return (
    <div className="fixed top-8 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>
          {sideBarItems.map((item, index) => {
            return (
              <div
               onClick={ () => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative p-2 hover:bg-gray-100 cursor-pointer rounded-lg my-3"
              >
                {item.Icon}
                <span className="text-gray-700">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
