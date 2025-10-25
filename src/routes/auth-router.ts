import { Router } from "express";
import { signUp } from "../controller/auth-controller";

const authRouther = Router();

authRouther.post("/sign-up", signUp);
// authRouther.post("/login");
// authRouther.post("/forgot-password");
// authRouther.post("/update-password");
// authRouther.post("/update-profile");
// authRouther.get("/me");
// authRouther.post("/sign-up-with-google");

export default authRouther;
