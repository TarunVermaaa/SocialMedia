import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";

const sampleChats = [
  {
    id: 1,
    username: "alice",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    preview: "Hey, how are you?",
    lastMessageTime: "2h",
  },
  {
    id: 2,
    username: "bob",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    preview: "Let's catch up tomorrow!",
    lastMessageTime: "1d",
  },
  {
    id: 3,
    username: "charlie",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    preview: "Did you watch the game?",
    lastMessageTime: "3h",
  },
];

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const [selectedChat, setSelectedChat] = useState(suggestedUsers[0] || null);
  const [message, setMessage] = useState("");
  const { onlineUsers } = useSelector((store) => store.chat);

  const dispatch = useDispatch();

  const sendMessageHandler = (e) => {
    e.preventDefault();
    console.log("Sending message:", message);
    setMessage("");
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
            <form onSubmit={sendMessageHandler} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" className="bg-black text-white px-5">
                Send
              </Button>
            </form>
          </div>
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
