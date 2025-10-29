import { Router } from "express";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  getAllFriendRequest,
  getAllFriends,
  removeFriend,
  sentFriendRequest,
} from "../controller/friend-controller";

const friendshipRouter = Router();

friendshipRouter.get("/get-all-friends", getAllFriends);
friendshipRouter.get("/get-friend-request", getAllFriendRequest);
friendshipRouter.get("/send-request/:id", sentFriendRequest);
friendshipRouter.get("/accept-request/:id", acceptFriendRequest);
friendshipRouter.get("/cancel-request/:id", cancelFriendRequest);
friendshipRouter.delete("/remove-friend/:id", removeFriend);

export default friendshipRouter;
