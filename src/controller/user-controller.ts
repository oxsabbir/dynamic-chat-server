import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import catchAsync from "../utils/catch-async";

export const getAllUser = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allUser = await User.find();
  res.status(200).json({
    status: "success",
    message: "successfully retrive users",
    data: {
      users: allUser,
    },
  });
});
