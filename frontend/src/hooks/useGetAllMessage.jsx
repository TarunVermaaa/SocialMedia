import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(
            setMessages({
              userId: selectedUser._id,
              messages: res.data.messages,
            })
          );
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchAllMessage();
  }, [selectedUser?._id]);
};

export default useGetAllMessage;
