import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { userSchema, loginSchema } from "../schema/user-schema";

import { verifyJwtSignature, generateJwtToken } from "../helpers/jwt-helper";
import { User as UserType } from "../types";

export const signUp = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // valdating user input
  const validInput = await validate(userSchema, req.body, res, next);
  if (!validInput) return;

  const userExist = await User.findOne({ email: validInput.email });
  if (userExist)
    return next({
      statusCode: 400,
      message: "user already exist with this email",
    });

  const userData = (await User.create(validInput)).toJSON();
  const finalData: any = { ...userData };
  delete finalData.password;

  // generating the token
  const token = generateJwtToken({
    userId: finalData._id,
    fullName: finalData.fullName,
    email: finalData.fullName,
  });

  res.status(201).json({
    status: "success",
    message: "User created",
    token,
    data: finalData,
  });
});

export const login = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validInput = await validate(loginSchema, req.body, res, next);
  if (!validInput) return;
  // check for user
  const userData = await User.findOne({ email: validInput.email });
  if (!userData)
    return next({
      statusCode: 404,
      message: "no user exist regarding to this email",
    });

  // comparing password
  const isCorrect =
    userData &&
    userData.comparePassword(validInput.password, userData.password);

  if (!isCorrect)
    return next({
      statusCode: 401,
      message: "incorrect password, please try again",
    });

  const plainUser = {
    userId: userData._id,
    fullName: userData.fullName,
    email: userData.email,
  };

  const token = generateJwtToken(plainUser);

  res.status(200).json({
    status: "success",
    message: "user login successful",
    token,
    data: plainUser,
  });
});

export const getMe = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("hi");
  next();
});

interface CustomRequest extends Request {
  user: Partial<UserType>;
}

export const routeProtect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorResponse = {
    statusCode: 401,
    message: "please login to get full access",
  };
  // getting the token from requeset headers
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(errorResponse);

  const decode = verifyJwtSignature(token);

  if (!decode?.email) return next(errorResponse);

  // see user exist
  const userData = await User.findOne({ email: decode.email }).select(
    "-password -passwordChangedAt"
  );

  (req as CustomRequest).user = userData || {};

  next();
});
