import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { setSelectedUser } from "@/redux/authSlice";
import {
  MessageCircleCode,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import { FaPaperPlane } from "react-icons/fa";

const ChatPage = () => {
  useGetAllMessage();
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );

  // Add conversation ID calculation
  const conversationId = selectedUser
    ? [user._id, selectedUser._id].sort().join("-")
    : null;

  const [selectedChat, setSelectedChat] = useState(suggestedUsers[0] || null);
  const { onlineUsers, messagesMap } = useSelector((store) => store.chat);
  const [textMessage, setTextMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Use conversation ID for messages
  const currentMessages = messagesMap[conversationId] || [];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // creating a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessageHandler = async (receiverId) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("message", textMessage);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        textMessage ? { message: textMessage } : formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(
          setMessages({
            userId: conversationId, // Use conversationId instead of receiverId
            messages: [...currentMessages, res.data.newMessage],
          })
        );
        setTextMessage("");
        clearImageSelection();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  h-screen overflow-hidden -ml-[46%]">
      {/* Left Sidebar */}
      <div className="w-[280px] min-w-[240px] max-w-[400px] border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">Chats</h2>
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser._id);

              return (
                <div
                  key={suggestedUser._id}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition 
                    ${
                      selectedUser?._id === suggestedUser._id
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={suggestedUser.profilePicture}
                      alt={suggestedUser.username}
                    />
                    <AvatarFallback>
                      {suggestedUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-col text-sm font-medium">
                      <span>{suggestedUser?.username}</span>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs font-semibold ${
                            isOnline ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {suggestedUser.lastMessageTime}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {suggestedUser.preview}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No users available</p>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col  bg-white">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-gray-300">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt={selectedChat?.username}
              />
              <AvatarFallback>
                {selectedUser?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{selectedUser?.username}</h3>
          </div>

          <Messages selectedUser={selectedUser} />

          {/* Message Input */}
          <div className="p-4 border-t border-gray-300">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              <Button
                onClick={() => sendMessageHandler(selectedUser._id)}
                disabled={(!textMessage && !selectedImage) || isLoading}
                className="rounded-full cursor-pointer !bg-white text-black hover:bg-blue-600"
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-12 -mr-2 animate-spin" />
                ) : (
                  <FaPaperPlane className="h-8 w-12 -mr-2" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current.click()}
                className="rounded-full !bg-white !border-none"
              >
                <ImageIcon className="h-12 w-12 ml-5" />
              </Button>
            </form>
          </div>

          {imagePreview && (
            <div className="mt-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 ml-4 rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 rounded-full h-6 w-6 "
                onClick={clearImageSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-2 items-center justify-center pl-8 mx-auto text-center">
          <MessageCircleCode className="w-24 h-24 " />
          <h1 className="!text-4xl font-semibold">Your messages</h1>
          <span className="text-gray-500">
            Send a message to start chatting
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
