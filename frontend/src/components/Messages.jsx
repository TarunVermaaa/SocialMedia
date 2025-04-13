import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import { motion, AnimatePresence } from "framer-motion";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messagesMap } = useSelector((store) => store.chat);
  const currentMessages = messagesMap[selectedUser?._id] || [];
  const { user } = useSelector((store) => store.auth);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if selectedUser exists
  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  // Animation variants for message bubbles
  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div
      className="overflow-y-auto flex-1 p-4"
      style={{
        msOverflowStyle: "none" /* IE and Edge */,
        scrollbarWidth: "none" /* Firefox */,
      }}
    >
      {/* Hide scrollbar for Chrome, Safari and Opera */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 ">
            <AvatarImage
              className="rounded-full"
              src={selectedUser?.profilePicture}
              alt="profile"
            />
            <AvatarFallback className=" !w-24 !h-24 rounded-full ml-6 !mt-5 text-4xl">
              {selectedUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold mb-1">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              variant="secondary"
              className="!bg-gray-100 !border-none hover:!bg-gray-200 !text-gray-800"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {currentMessages.map((msg) => (
            <motion.div
              key={msg._id}
              className={`flex ${
                msg.senderId === user?._id ? "justify-end" : "justify-start"
              }`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={messageVariants}
              layout
            >
              <motion.div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                  msg.senderId === user?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* for Text Message */}
                {msg.messageType === "text" && msg.message}

                {/* for Image Message */}
                {msg.messageType === "image" && (
                  <div className="flex flex-col gap-2">
                    <img
                      src={msg.imageUrl}
                      alt="Shared Image"
                      className="max-w-full h-auto rounded-lg"
                      style={{ maxHeight: "300px" }}
                    />
                    {msg.message && (
                      <p className="text-sm text-gray-600">{msg.message}</p>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
