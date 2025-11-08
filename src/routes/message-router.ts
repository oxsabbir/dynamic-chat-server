import { Router } from "express";
import { getInbox, getMessages } from "../controller/message-controller";

const messageRouter = Router();

messageRouter.get("/inbox", getInbox);

messageRouter.get("/:id", getMessages);

export default messageRouter;
