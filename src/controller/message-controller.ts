import { NextFunction, Request, Response } from "express";
import Message from "../model/Message";
import catchAsync from "../utils/catch-async";

import Group from "../model/Group";

export const getInbox = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // inbox should have the recent message with friend

  const groupes = res.status(200).json({
    status: "success",
    message: "Inbox retrieved sucessfully",
    data: {
      friends: [],
      groups: [],
    },
  });
});
