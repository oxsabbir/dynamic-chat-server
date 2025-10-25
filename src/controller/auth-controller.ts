import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import catchAsync from "../utils/catch-async";

export const signUp = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {} = req;
});
