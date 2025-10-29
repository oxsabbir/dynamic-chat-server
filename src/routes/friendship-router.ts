import { Router } from "express";
import {
  acceptFriendRequest,
  manageBlocking,
  cancelFriendRequest,
  getAllFriendRequest,
  getAllFriends,
  removeFriend,
  sentFriendRequest,
} from "../controller/friend-controller";

const friendshipRouter = Router();

friendshipRouter.get("/get-all-friends", getAllFriends);
friendshipRouter.get("/get-friend-request", getAllFriendRequest);
friendshipRouter.post("/send-request/:id", sentFriendRequest);
friendshipRouter.post("/accept-request/:id", acceptFriendRequest);
friendshipRouter.post("/block-friend/:id", manageBlocking("block"));
friendshipRouter.post("/unblock-friend/:id", manageBlocking("unblock"));
friendshipRouter.delete("/cancel-request/:id", cancelFriendRequest);
friendshipRouter.delete("/remove-friend/:id", removeFriend);

export default friendshipRouter;
