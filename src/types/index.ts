import { Document, ObjectId } from "mongoose";

export interface User extends Document {
  fullName: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry: Date;
  refreshToken?: string;
  passwordChangedAt?: string;
  createdAt: Date;
}

export interface Group extends Document {
  name: string;
  profile: string;
  members: ObjectId[];
  admin: ObjectId;
  createdAt: Date;
}

export interface Message extends Document {
  sender: ObjectId;
  receiver: ObjectId;
  status: "sent" | "seen";
  type: "text" | "mixed";
  sendTo: "dm" | "group";
  createdAt: Date;
}
