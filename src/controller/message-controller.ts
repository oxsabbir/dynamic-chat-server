import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import catchAsync from "../utils/catch-async";
import Conversation from "../model/Conversation";
import { CustomRequest } from "../types";

export const getInbox = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  // inbox should have the recent message with friend
  const conversation = await Conversation.find({
    participant: { $in: selfId },
  });

  res.status(200).json({
    status: "success",
    message: "Inbox retrieved sucessfully",
    data: {
      conversation,
    },
  });
});
