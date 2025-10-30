import { Router } from "express";
import { getAllUser } from "../controller/user-controller";

const userRouter = Router();

userRouter.get("/", getAllUser);

export default userRouter;
