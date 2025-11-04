import { Router } from "express";
import { getInbox } from "../controller/message-controller";

const messageRouter = Router();

messageRouter.get("/inbox", getInbox);

export default messageRouter;
