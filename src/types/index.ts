import { Document } from "mongoose";

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
