import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessage } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Dono users ke liye store karein
      dispatch(
        addMessage({
          userId: newMessage.senderId,
          message: newMessage,
        })
      );
      dispatch(
        addMessage({
          userId: newMessage.receiverId,
          message: newMessage,
        })
      );
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRTM;
