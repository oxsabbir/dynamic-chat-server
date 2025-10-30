import { Router } from "express";
import {
  acceptFriendRequest,
  manageBlocking,
  cancelFriendRequest,
  getAllFriendRequest,
  getAllFriends,
  removeFriend,
  sentFriendRequest,
  getBlockedUserList,
} from "../controller/friend-controller";

const friendshipRouter = Router();

friendshipRouter.get("/", getAllFriends);
friendshipRouter.get("/friend-request", getAllFriendRequest);
friendshipRouter.post("/send-request/:id", sentFriendRequest);
friendshipRouter.post("/accept-request/:id", acceptFriendRequest);
friendshipRouter.get("/blocked-user", getBlockedUserList);
friendshipRouter.post("/block/:id", manageBlocking("block"));
friendshipRouter.post("/unblock/:id", manageBlocking("unblock"));
friendshipRouter.delete("/cancel-request/:id", cancelFriendRequest);
friendshipRouter.delete("/remove/:id", removeFriend);

export default friendshipRouter;
