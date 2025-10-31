import { Router } from "express";
import {
  signUp,
  login,
  getMe,
  routeProtect,
  updateProfile,
} from "../controller/auth-controller";
import { upload } from "../middleware/upload";

const authRouther = Router();

authRouther.post("/sign-up", signUp);
authRouther.post("/login", login);
// authRouther.post("/forgot-password");
// authRouther.post("/update-password");
authRouther.post(
  "/update-profile",
  routeProtect,
  upload.single("profile"),
  updateProfile
);
authRouther.get("/me", routeProtect, getMe);
// authRouther.post("/sign-up-with-google");

export default authRouther;
