import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { user, selectedUser } = useSelector((store) => store.auth);

  // Calculate conversation ID consistently
  const conversationId = selectedUser
    ? [user._id, selectedUser._id].sort().join("-")
    : null;

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${
            selectedUser._id
          }?t=${Date.now()}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(
            setMessages({
              userId: conversationId, // Use conversation ID
              messages: res.data.messages,
            })
          );
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchAllMessage();

    const interval = setInterval(fetchAllMessage, 15000);

    return () => clearInterval(interval);
  }, [selectedUser?._id, conversationId, dispatch, user._id]); // Include all dependencies

  return null;
};

export default useGetAllMessage;
