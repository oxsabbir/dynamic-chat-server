import mongoose, { Schema, model } from "mongoose";
import { FriendShip } from "../types";

const friendShipSchema = new Schema<FriendShip>({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model("FriendShip", friendShipSchema);
