import mongoose, { Schema, model } from "mongoose";
import { Message } from "../types";

const messageSchema = new Schema<Message>({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  message: {
    type: String,
  },
  conversation: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Conversation",
  },
  status: {
    type: String,
    enum: ["sent", "seen"],
    default: "sent",
  },
  sendTo: {
    type: String,
    enum: ["dm", "group"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Message", messageSchema);
