import { NextFunction, Request, Response } from "express";
import Friendship from "../model/Friendship";
import catchAsync from "../utils/catch-async";
import { CustomRequest } from "../types";

export const getAllFriendRequest = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;

  const requestList = await Friendship.find({
    receiver: selfId,
    status: "pending",
  });
  res.status(200).json({
    status: "success",
    message: "successfully retrive friend request",
    data: {
      requests: requestList,
    },
  });
});

export const getAllFriends = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const friendsList = await Friendship.find({
    status: "accepted",
    $or: [{ sender: selfId }, { receiver: selfId }],
  });

  res.status(200).json({
    status: "success",
    message: "successfully retirve friend",
    data: {
      friend: friendsList,
    },
  });
});

export const acceptFriendRequest = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get the id of user to accept request
  const userId = req.params.id;
  const selfId = (req as CustomRequest).user.id;
  if (!userId)
    return next({
      statusCode: 400,
      message: "please provide user-id to accept request",
    });
  // check if theres any pending request for me from that user
  const pendingRequest = await Friendship.findOne({
    status: "pending",
    receiver: selfId,
    sender: userId,
  });
  if (!pendingRequest)
    return next({
      statusCode: 404,
      message: "no friend request found with the user-id",
    });

  // finally accepty request by changing the status
  const acceptedFriend = await Friendship.findByIdAndUpdate(pendingRequest.id, {
    status: "accepted",
  });

  if (!acceptFriendRequest)
    return next({
      statusCode: 405,
      message: "something went wrong, can't accept request",
    });

  // send response
  res.status(201).json({
    status: "success",
    message: "friend request accepted successfully",
    data: {
      friend: acceptedFriend,
    },
  });
});

export const sentFriendRequest = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get userId to send friend request
  const userId = req.params.id;
  if (!userId) return next({ statusCode: 400, messsage: "user-id not found!" });

  const selfId = (req as CustomRequest).user.id;

  if (userId === selfId)
    return next({
      statusCode: 400,
      message: "you can't sent request to yourself",
    });

  // check if already a friend
  const isFriend = await Friendship.exists({
    $or: [{ sender: userId, receiver: userId }],
    status: "accepted",
  });

  if (isFriend)
    return next({ statusCode: 400, message: "provided user already a friend" });

  // check if request is pending
  const isPending = await Friendship.exists({
    sender: selfId,
    receiver: userId,
    status: "pending",
  });

  if (isPending)
    return next({ statusCode: 400, message: "request already sent" });

  // create friendship document
  const friendship = await Friendship.create({
    sender: selfId,
    receiver: userId,
  });

  res.status(201).json({
    status: "success",
    message: "friend request sent successfully",
    data: {
      request: friendship,
    },
  });
});
