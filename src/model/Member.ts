import mongoose, { Schema, model } from "mongoose";
import { IMember } from "../types";

const memberSchema = new Schema<IMember>({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Group",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Member = model("Member", memberSchema);
export default Member;
