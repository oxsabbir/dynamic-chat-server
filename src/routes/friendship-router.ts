import { Router } from "express";
import {
  getAllFriendRequest,
  getAllFriends,
  sentFriendRequest,
} from "../controller/friend-controller";

const friendshipRouter = Router();

friendshipRouter.get("/get-all-friends", getAllFriends);
friendshipRouter.get("/get-friend-request", getAllFriendRequest);
friendshipRouter.get("/send-request/:id", sentFriendRequest);

export default friendshipRouter;
