import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();

  const { messagesMap } = useSelector((store) => store.chat);
  const currentMessages = messagesMap[selectedUser?._id] || [];

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage
              className="w-20 h-20 rounded-full"
              src={selectedUser?.profilePicture}
              alt="profile"
            />
            <AvatarFallback>
              {selectedUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              variant="secondary"
              className="mt-1  !bg-gray-100 !border-none hover:!bg-gray-200 !text-gray-800"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {currentMessages.map((msg) => (
          <div key={msg._id}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
