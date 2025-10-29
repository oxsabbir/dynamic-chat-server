import mongoose, { Schema, model } from "mongoose";
import { Group } from "../types";

const groupSchema = new Schema<Group>({
  name: {
    type: String,
    require: [true, "group name is required"],
  },
  profile: {
    type: String,
  },
  members: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
  admin: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Group = model("Group", groupSchema);
export default Group;
