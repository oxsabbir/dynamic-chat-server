import { Router } from "express";
import {
  acceptFriendRequest,
  getAllFriendRequest,
  getAllFriends,
  sentFriendRequest,
} from "../controller/friend-controller";

const friendshipRouter = Router();

friendshipRouter.get("/get-all-friends", getAllFriends);
friendshipRouter.get("/get-friend-request", getAllFriendRequest);
friendshipRouter.get("/accept-request/:id", acceptFriendRequest);
friendshipRouter.get("/send-request/:id", sentFriendRequest);

export default friendshipRouter;
