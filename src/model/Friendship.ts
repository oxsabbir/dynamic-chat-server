import mongoose, { Schema, model } from "mongoose";
import { FriendShip } from "../types";

const friendShipSchema = new Schema<FriendShip>({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "deleted"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("FriendShip", friendShipSchema);
