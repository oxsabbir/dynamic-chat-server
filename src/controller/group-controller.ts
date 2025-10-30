import { NextFunction, Request, Response } from "express";
import Group from "../model/Group";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { groupSchema, memberSchema } from "../schema/group-schema";
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
    members: [...members, selfId],
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

export const addMember = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const groupId = req.params.id;

  const validMember = await validate(memberSchema, req.body, res, next);
  if (!validMember) return;

  console.log(validMember?.members);

  const group = await Group.findByIdAndUpdate(
    groupId,
    {
      $addToSet: { members: { $each: validMember.members } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "succes",
    message: "New member added successfully",
    data: {
      group: group,
    },
  });
});

export const removeGroup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const groupId = req.params.id;
  const selfId = (req as CustomRequest).user.id;

  const group = await Group.findOne({ _id: groupId });
  if (!group)
    return next({
      statusCode: 404,
      message: "Group not found using provided id",
    });

  if (group.admin !== selfId)
    return next({
      statusCode: 403,
      message: "Only group admin can delete the group",
    });

  // when removing group. we must remove all messages that are relavant to this group

  // for that i will use transaction later
  const removedGroup = await Group.findByIdAndDelete(groupId);

  res.status(204).json({
    status: "success",
    message: "Group removed successfully",
    data: {
      group: removedGroup,
    },
  });
});
