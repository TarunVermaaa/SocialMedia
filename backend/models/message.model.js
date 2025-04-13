import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: false },
  imageUrl : {type: String , required: false},
  messageType : {type: String , enum: ["text" , "image"] , default: "text"}
});

export const Message = mongoose.model("Message", messageSchema);
