import { Router } from "express";
import {
  signUp,
  login,
  getMe,
  routeProtect,
  updateProfile,
  tokenRotate,
  forgotPassword,
  resetPassword,
} from "../controller/auth-controller";

import { upload } from "../middleware/upload";

const authRouther = Router();

authRouther.post("/sign-up", signUp);
authRouther.post("/login", login);
authRouther.get("/refresh", tokenRotate);
authRouther.post("/forgot-password", forgotPassword);
authRouther.post("/reset-password/:resetToken", resetPassword);
authRouther.post(
  "/update-profile",
  routeProtect,
  upload.single("profile"),
  updateProfile
);
authRouther.get("/me", routeProtect, getMe);

export default authRouther;
