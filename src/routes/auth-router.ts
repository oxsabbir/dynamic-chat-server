import { Router } from "express";

const authRouther = Router();

authRouther.post("/sign-up");
authRouther.post("/login");
authRouther.post("/forgot-password");
authRouther.post("/update-password");
authRouther.post("/update-profile");
authRouther.get("/me");
authRouther.post("/sign-up-with-google");

export default authRouther;
