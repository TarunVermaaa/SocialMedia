// for chatting feature

import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.userId;

    // Check if receiverId is not undefined or empty
    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const { message } = req.body;
    const image = req.file;

    // Check if message is not undefined or empty
    if (!message && !image) {
      return res
        .status(400)
        .json({ error: "Message content or image is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    let imageUrl = null;
    let messageType = "text";

    if (image) {
      const fileUri = await getDataUri(image);

      const cloudResponse = await Cloudinary.uploader.upload(fileUri, {
        folder: "chat_images",
      });

      imageUrl = cloudResponse.secure_url;
      messageType = "image";
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      imageUrl,
      messageType,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // implement socket io for real time messaging
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.userId;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      return res.status(404).json({ message: [], success: false });
    }
    return res
      .status(200)
      .json({ messages: conversation?.messages, success: true });
  } catch (error) {
    console.log(error);
  }
};
