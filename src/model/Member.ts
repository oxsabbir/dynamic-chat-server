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

memberSchema.index({ group: 1, user: 1 }, { unique: true });

const Member = model("Member", memberSchema);
export default Member;
