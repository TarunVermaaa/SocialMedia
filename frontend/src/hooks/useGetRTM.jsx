import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    // Skip if user is not logged in
    if (!user) return;

    const handleNewMessage = (newMessage) => {
      // Create conversation ID by sorting the IDs to ensure consistency
      const conversationId = [newMessage.senderId, newMessage.receiverId]
        .sort()
        .join("-");

      // Store only once using conversation ID
      dispatch(
        addMessage({
          userId: conversationId,
          message: newMessage,
        })
      );
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, user?.id]); // Use optional chaining here

  return null;
};

export default useGetRTM;
