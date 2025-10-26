import { Schema, model } from "mongoose";
import { User } from "../types";
import * as bcryptjs from "bcryptjs";

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

userSchema.methods.comparePassword = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return bcryptjs.compare(plainPassword, hashedPassword);
};

userSchema.pre("save", async function (next) {
  // checking for password
  if (!this.password) next();

  // checking if the user is fresh new user
  if (!this.isModified()) return next();

  // finally hashing the password and saving it
  this.password = await bcryptjs.hash(this.password, 12);

  next();
});

const User = model("User", userSchema);
export default User;
