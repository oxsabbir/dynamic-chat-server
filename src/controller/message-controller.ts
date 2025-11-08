import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import catchAsync from "../utils/catch-async";
import Conversation from "../model/Conversation";
import { CustomRequest } from "../types";
import mongoose from "mongoose";
import Group from "../model/Group";
import Member from "../model/Member";

export const getInbox = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const selfObjectId = new mongoose.Types.ObjectId(selfId as string);

  // first get all the group that user in
  const userGroup = await Member.find({ user: selfObjectId })
    .select("group")
    .lean();

  const groupIds = userGroup.map((group) => group.group);

  // inbox should have the recent message with friend
  const conversation = await Conversation.aggregate([
    {
      $match: {
        $or: [
          { participant: { $in: [selfObjectId] } },
          { group: { $in: groupIds } },
        ],
      },
    },
    { $sort: { lastMessageTime: -1 } },
  ]);

  res.status(200).json({
    status: "success",
    message: "Inbox retrieved sucessfully",
    data: {
      conversation,
    },
  });
});
