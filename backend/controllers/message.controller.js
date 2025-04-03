// for chatting feature

import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const sendMessage = async (req , res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId]        
      })
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    })

    if(newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()])

    return res.status(201).json({ message: "Message sent successfully", newMessage, success: true });

    
  } catch (error) {
    console.log(error);
  }
}

export const getMessages = async (req , res) => {
  try {

    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] }
    })
    if (!conversation) {
      return res.status(404).json({ message: [] , success: false });
    }
    return res.status(200).json({ messages: conversation?.messages, success: true });

    
  } catch (error) {
    console.log(error);
  }
}