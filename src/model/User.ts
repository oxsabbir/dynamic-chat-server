import { Schema, model } from "mongoose";
import { User } from "../types";

const userSchema = new Schema<User>({
  fullName: {
    type: String,
    require: [true, "fullname is required"],
  },
  email: {
    type: String,
    required: [true, "email address is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  refreshToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = model("User", userSchema);
export default User;
