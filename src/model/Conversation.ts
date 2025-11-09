import mongoose, { Schema, model } from "mongoose";
import { Conversation } from "../types";

const conversationSchema = new Schema<Conversation>({
  participant: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  isGroup: {
    type: Boolean,
  },
  group: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Group",
  },
  lastMessage: {
    type: String,
  },
  lastMessageTime: {
    type: Date,
    default: Date.now(),
  },

  hasChecked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Conversation", conversationSchema);
