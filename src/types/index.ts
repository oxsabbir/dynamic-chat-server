import { Document, ObjectId } from "mongoose";
import { Request } from "express";

export interface User extends Document {
  fullName: string;
  email: string;
  profile: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  refreshToken?: string;
  passwordChangedAt?: string;
  blocked: ObjectId[];
  comparePassword: (
    plainPassword: string,
    hashedPassword: string
  ) => Promise<boolean>;
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

export interface FriendShip extends Document {
  sender: ObjectId;
  receiver: ObjectId;
  status: "pending" | "accepted" | "deleted";
  createdAt: Date;
}

export interface Blocking extends Document {
  blocker: ObjectId;
  blocked: ObjectId;
  createdAt: Date;
}

export interface CustomRequest extends Request {
  user: Partial<User>;
}
