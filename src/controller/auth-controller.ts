import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { userSchema, loginSchema } from "../schema/user-schema";

import { verifyJwtSignature, generateJwtToken } from "../helpers/jwt-helper";
import { User as UserType } from "../types";
import { uploadFile } from "../helpers/cloudinary-helpers";
import { errorMessage } from "../utils/send-response";
import { getHashedString, randomHasedString } from "../helpers/crypto-helpers";

interface CustomRequest extends Request {
  user: Partial<UserType>;
}

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
      message: "User already exist with this email",
    });

  const userData = (await User.create(validInput)).toJSON();

  // generating the token
  const refreshToken = generateJwtToken(
    {
      userId: userData._id,
      fullName: userData.fullName,
      email: userData.email,
    },
    "refresh"
  );

  const token = generateJwtToken({
    userId: userData._id,
    fullName: userData.fullName,
    email: userData.email,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    status: "success",
    message: "User created",
    token,
    data: userData,
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
  const userData = await User.findOne({ email: validInput.email }).select(
    "+password"
  );
  if (!userData)
    return next({
      statusCode: 404,
      message: "No user exist regarding to this email",
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

  const refreshToken = generateJwtToken(plainUser, "refresh");

  // saving the refresh token into db
  if (userData._id && refreshToken) {
    await replaceRefreshToken(userData._id as string, refreshToken);
  }
  const userDataModified: Partial<UserType> = {
    ...userData.toObject(),
  };
  delete userDataModified.password;
  delete userDataModified.blocked;

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    message: "user login successful",
    token: token,
    data: {
      user: userDataModified,
    },
  });
});

export const tokenRotate = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get the refresh token first
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return next(
      errorMessage(401, "Cannot find the refresh-token, Login and try again")
    );

  // check if it's valid token or not
  const verify = verifyJwtSignature(refreshToken, "refresh");

  // see if it's same as the token that stored on the DB
  const hashedToken = getHashedString(refreshToken);
  const authUser = await User.findOne({
    refreshToken: hashedToken,
  });

  if (!authUser) return next(errorMessage(403, "Invalid refresh token"));

  const plainUser = {
    userId: authUser._id,
    fullName: authUser.fullName,
    email: authUser.email,
  };

  if (!verify || !authUser?.email)
    return next(errorMessage(403, "Invalid refresh token"));

  // if all went right. then generete new access token and new refresh token and store it to db
  const newRefreshToken = generateJwtToken(plainUser, "refresh");
  const newAccessToken = generateJwtToken(plainUser, "access");

  const updatedUser = await User.findByIdAndUpdate(
    authUser?.id,
    {
      refreshToken: newRefreshToken,
    },
    { new: true }
  );
  await replaceRefreshToken(authUser?.id, newRefreshToken);

  // sent the new refresh token as http only cookie
  res.cookie("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // send new access token as response
  res.status(200).json({
    status: "success",
    message: "Token validated successfully",
    token: newAccessToken,
    data: {
      user: updatedUser,
    },
  });
});

export const getMe = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as CustomRequest).user;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const routeProtect = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorResponse = {
    statusCode: 401,
    message: "Please login to get full access",
  };
  // getting the token from requeset headers
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(errorResponse);

  const decode = verifyJwtSignature(token);

  if (!decode?.email) return next(errorResponse);

  // see user exist
  const userData = await User.findOne({ email: decode.email });

  (req as CustomRequest).user = userData || {};
  next();
});

export const forgotPassword = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validInput = await validate(
    userSchema.pick({ email: true }),
    req.body,
    res,
    next
  );
  if (!validInput) return;

  const user = await User.findOne({ email: validInput.email });
  if (!user) return next(errorMessage(404, "No user found using this email"));

  // generate resetToken
  const resetToken = getHashedString(randomHasedString());

  // user it temporerily on DB

  const resetTokenExpiry = new Date().getTime() + 10 * 60 * 1000; // 10 minutes of expiry time

  const updatedUser = await User.findByIdAndUpdate(user._id, {
    resetToken: resetToken,
    resetTokenExpiry: new Date(resetTokenExpiry).toISOString(),
  });

  // send the token using email

  res.status(200).json({
    status: "success",
    message: "We've sent you an reset token to your email",
    data: {
      resetToken: resetToken,
    },
  });
});

export const resetPassword = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validInput = await validate(
    userSchema.pick({ password: true }),
    req.body,
    res,
    next
  );
  if (!validInput) return;

  console.log("hi");

  // get the hashed token
  const resetToken = req.params.resetToken;

  // check if it matches and did't expires
  const tokenMatch = await User.findOne({
    resetToken: resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!tokenMatch)
    return next(
      errorMessage(401, "Invalid reset token or reset token expired")
    );

  // change the password
  const updatedUser = await User.findByIdAndUpdate(
    tokenMatch.id,
    {
      password: validInput.password,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

export const updateProfile = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validData = await validate(
    userSchema.pick({ fullName: true }),
    req.body,
    res,
    next
  );
  if (!validData) return;
  const imageFile = req.file;
  // if no file found uploadFile will silently return and do nothing then result would be emply

  const userInfo: Partial<UserType> = {
    fullName: validData.fullName,
  };

  const selfId = (req as CustomRequest).user.id;
  const result = await uploadFile(imageFile, `dynamic-chat/profile/${selfId}`);
  if (result?.secure_url) {
    userInfo.profile = result.secure_url;
  }
  const updatedUser = await User.findByIdAndUpdate(selfId, userInfo, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

const replaceRefreshToken = async function (
  userId: string,
  token: string | undefined
) {
  if (!token) return;
  const hashedToken = getHashedString(token);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      refreshToken: hashedToken,
    },
    { new: true }
  );
  return updatedUser;
};
