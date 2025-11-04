import mongoose, { Schema, model } from "mongoose";
import { Conversation } from "../types";

const conversationSchema = new Schema<Conversation>({
  participant: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  lastMessage: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  lastMessageTime: {
    type: Date,
    default: Date.now(),
  },
  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Conversation", conversationSchema);
