import { NextFunction, Request, Response } from "express";
import Group from "../model/Group";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import groupSchema from "../schema/group-schema";
import { CustomRequest } from "../types";

export const getAllGroups = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const groupList = await Group.find({
    $or: [{ admin: selfId }, { members: { $in: selfId } }],
  });

  res.status(200).json({
    status: "success",
    message: "Groups retrived successfully",
    data: {
      group: groupList,
    },
  });
});

export const getGroup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const groupId = req.params.id;
  const group = await Group.findById(groupId).populate([
    {
      path: "members",
      select: "fullName profile",
    },
    {
      path: "admin",
      select: "fullName profile",
    },
  ]);

  // later here we will get the last 20 message
  const messages = ["hi"];

  res.status(200).json({
    status: "success",
    message: "Group retrived successfully",
    data: {
      group: group,
      messages: messages,
    },
  });
});

export const createGroup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validBody = await validate(groupSchema, req.body, res, next);
  if (!validBody) return;

  const members = validBody.members;

  const selfId = (req as CustomRequest).user.id;

  const group = await Group.create({
    admin: selfId,
    name: validBody.name,
    members,
  });

  const admin = "";

  res.status(200).json({
    status: "success",
    message: "Group created successfully",
    data: {
      group: group,
    },
  });
});
