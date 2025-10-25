import mongoose, { Schema, model } from "mongoose";
import { Message } from "../types";

const messageSchema = new Schema<Message>({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "mixed"],
    default: "text",
  },
  sendTo: {
    type: String,
    enum: ["dm", "group"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("Message", messageSchema);
