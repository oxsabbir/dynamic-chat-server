import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { userSchema } from "../schema/user-schema";

export const signUp = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // valdating user input
  const validInput = await validate(userSchema, req.body, res, next);
  if (!validInput) return;

  res.status(201).json({
    status: "success",
    message: "User created",
    data: {
      ...validInput,
    },
  });
});
