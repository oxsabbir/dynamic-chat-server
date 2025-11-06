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

// groupSchema.pre(/^find/, function (next) {
//   (this as mongoose.Query<any, any>).populate([
//     {
//       path: "members",
//       select: "fullName profile email",
//     },
//     {
//       path: "admin",
//       select: "fullName profile email",
//     },
//   ]);
//   next();
// });

const Group = model("Group", groupSchema);
export default Group;
