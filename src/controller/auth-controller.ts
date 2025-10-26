import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { userSchema, loginSchema } from "../schema/user-schema";
import generateJwtToken from "../helpers/genrateJwtToken";
import { verifyJwtSignature } from "../helpers/jwt-helper";

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

  console.log(isCorrect);
});

export const routeProtect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {});
