import { Router } from "express";
import { getAllUser } from "../controller/user-controller";

const userRouter = Router();

userRouter.get("/get-all-user", getAllUser);

export default userRouter;
