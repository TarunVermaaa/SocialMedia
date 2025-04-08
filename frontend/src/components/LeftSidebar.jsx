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
  
  return (
    <div className="fixed top-8 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1>LOGO</h1>
        <div>
          {sideBarItems.map((item, index) => {
            return (
              <div
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
