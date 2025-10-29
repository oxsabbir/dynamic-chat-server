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
  res.status(200).json({
    status: "success",
    message: "Groups retrived successfully",
  });
});

export const getGroup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json({
    status: "success",
    message: "Group retrived successfully",
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

  console.log(group);

  const admin = "";

  res.status(200).json({
    status: "success",
    message: "Group created successfully",
    data: {
      members,
      admin,
    },
  });
});
