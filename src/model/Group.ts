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
    },
  ],
  admin: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Group = model("Group", groupSchema);
export default Group;
