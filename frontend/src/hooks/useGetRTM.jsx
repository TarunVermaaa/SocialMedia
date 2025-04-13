import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
const {socket} = useSelector(store => store.socketio)
const {messagesMap} = useSelector(store => store.chat)

  useEffect(() => {

    socket?.on('newMessage' , (newMessage) => {
      dispatch(setMessages({
        userId: newMessage.senderId,
        messages: [...messagesMap[newMessage.senderId] || [], newMessage],
      }))
    })

    return () => {
      socket?.off('newMessage')
    }

   
  }, [ messagesMap , setMessages]);
};

export default useGetRTM;
