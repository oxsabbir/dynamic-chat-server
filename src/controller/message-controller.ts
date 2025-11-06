import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import catchAsync from "../utils/catch-async";
import Conversation from "../model/Conversation";
import { CustomRequest } from "../types";
import mongoose from "mongoose";

export const getInbox = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const selfObjectId = new mongoose.Types.ObjectId(selfId as string);
  // inbox should have the recent message with friend
  const conversation = await Conversation.aggregate([
    {
      $match: {
        $or: [{ participant: { $in: [selfObjectId] } }, { isGroup: true }],
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    message: "Inbox retrieved sucessfully",
    data: {
      conversation,
    },
  });
});
