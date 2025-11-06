import { NextFunction, Request, Response } from "express";
import Group from "../model/Group";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { groupSchema } from "../schema/group-schema";
import { CustomRequest } from "../types";
import { errorMessage } from "../utils/send-response";
import Member from "../model/Member";

export const getAllGroups = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const members = await Member.find({ user: selfId }).select("group");
  const groupIds = members.map((member) => member.group);
  console.log(groupIds);

  const groupList = await Group.find({
    _id: { $in: groupIds },
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

  if (!group)
    return next(errorMessage(404, "No group found using provided id"));

  res.status(200).json({
    status: "success",
    message: "Group retrived successfully",
    data: {
      group: group,
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

  const selfId = (req as CustomRequest).user.id;

  // adding creator as an member as well
  validBody.members.push(selfId);

  // first create the group
  const group = await Group.create({
    admin: selfId,
    name: validBody.name,
  });
  // once the group is created add member by creating member data if any member id provided
  if (group && validBody.members.length > 0) {
    await Member.insertMany(
      validBody.members.map((userId) => ({ group: group.id, user: userId }))
    );
  }

  res.status(200).json({
    status: "success",
    message: "Group created successfully",
    data: {
      group: group,
    },
  });
});

export const manageMembers = function (actionType: "add" | "remove") {
  return catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const groupId = req.params.id;
    const selfId = (req as CustomRequest).user.id;

    const isGroupAdmin = await Group.findOne({ _id: groupId, admin: selfId });

    // only admin can remove a member from the group
    if (!isGroupAdmin)
      return next({
        statusCode: 403,
        message: "Only admin can remove member from the group",
      });

    // only validating for members
    const validMember = await validate(
      groupSchema.pick({ members: true }),
      req.body,
      res,
      next
    );
    if (!validMember) return;

    // before leaving group admin make someone else an admin

    if (isGroupAdmin && validMember.members.includes(selfId))
      return next({
        statusCode: 400,
        message:
          "Admin cannot leave the group. please make someone else an admin",
      });

    const filterObject =
      actionType === "add"
        ? {
            $addToSet: { members: { $each: validMember.members } },
          }
        : {
            $pull: { members: { $in: validMember.members } },
          };

    const group = await Group.findByIdAndUpdate(groupId, filterObject, {
      new: true,
    });

    res.status(200).json({
      status: "succes",
      message: "New member added successfully",
      data: {
        group: group,
      },
    });
  });
};

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

export const updateGroup = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const groupId = req.params.id;

  const validData = await validate(
    groupSchema.omit({ members: true }),
    req.body,
    res,
    next
  );
  if (!validData) return;

  const group = await Group.findByIdAndUpdate(groupId, validData, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Group updated successfully",
    data: {
      group: group,
    },
  });
});
