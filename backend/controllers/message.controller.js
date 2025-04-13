// for chatting feature

import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { io } from "../socket/socket.js";
import Cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.userId;

    // Validation checks
    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    const { message } = req.body;
    const image = req.file;

    if (!message && !image) {
      return res.status(400).json({
        error: "Message content or image is required",
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    // Handle image upload
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

    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message || "", // Handle empty message
      imageUrl,
      messageType,
    });

    // Update conversation
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // ✅ Fixed Socket.IO Implementation
    io.to(senderId.toString()).emit("newMessage", newMessage);
    io.to(receiverId.toString()).emit("newMessage", newMessage);

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.userId;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ messages: [], success: true });
    }

    return res.status(200).json({
      messages: conversation.messages,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
