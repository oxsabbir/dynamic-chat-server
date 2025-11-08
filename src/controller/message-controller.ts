import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import catchAsync from "../utils/catch-async";
import Conversation from "../model/Conversation";
import { CustomRequest } from "../types";
import mongoose from "mongoose";
import Member from "../model/Member";
import { errorMessage } from "../utils/send-response";

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

export const getMessages = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get the conversation id to get specifiec message for each conversation

  const selfId = (req as CustomRequest).user.id;

  const conversationId = req.params.id;

  const messages = await Message.find({
    conversation: conversationId,
  }).populate({
    path: "sender",
    select: "fullName profile",
  });

  if (!messages) return next(errorMessage(405, "Failed to get message"));

  res.status(200).json({
    status: "success",
    message: "Inbox retrieved sucessfully",
    data: {
      messages: messages,
    },
  });
});
