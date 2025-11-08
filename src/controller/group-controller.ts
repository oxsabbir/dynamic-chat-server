import { NextFunction, Request, Response } from "express";
import Group from "../model/Group";
import catchAsync from "../utils/catch-async";
import validate from "../helpers/validate";
import { groupSchema } from "../schema/group-schema";
import { CustomRequest } from "../types";
import { errorMessage } from "../utils/send-response";
import Member from "../model/Member";
import mongoose, { Types } from "mongoose";
import Message from "../model/Message";

export const getAllGroups = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const selfId = (req as CustomRequest).user.id;
  const members = await Member.find({ user: selfId }).select("group");
  const groupIds = members.map((member) => member.group);

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

  const groupData = await Group.aggregate([
    // 1️⃣ Match the group by ID
    {
      $match: { _id: new mongoose.Types.ObjectId(groupId) },
    },

    {
      $lookup: {
        from: "users",
        localField: "admin",
        foreignField: "_id",
        as: "admin",
      },
    },
    { $unwind: "$admin" },

    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "group",
        as: "members",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "members.user",
        foreignField: "_id",
        as: "memberUsers",
      },
    },

    {
      $unset: [
        "memberUsers.password",
        "memberUsers.resetToken",
        "memberUsers.refreshToken",
      ],
    },

    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdAt: 1,

        "admin._id": 1,
        "admin.fullName": 1,
        "admin.profile": 1,
        // here we are looping over members
        members: {
          $map: {
            input: "$memberUsers",
            as: "member",
            in: {
              _id: "$$member._id",
              fullName: "$$member.fullName",
              profile: "$$member.profile",
            },
          },
        },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    message: "Group retrived successfully",
    data: {
      group: groupData,
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

    if (
      isGroupAdmin &&
      validMember.members.includes(selfId) &&
      actionType === "remove"
    )
      return next({
        statusCode: 400,
        message:
          "Admin cannot leave the group. please make someone else an admin",
      });

    // here we are add and removing member
    if (actionType === "add") {
      await Member.create(
        validMember.members.map((memberId) => ({
          user: memberId,
          group: groupId,
        }))
      );
    } else if (actionType === "remove") {
      await Member.deleteMany({
        group: groupId,
        user: { $in: validMember.members },
      });
    }

    const group = await Group.findById(groupId);

    const groupMembers = await Member.find({ group: group?._id })
      .select("user -_id")
      .populate({
        path: "user",
        select: "fullName profile",
      });

    const flattendMember = groupMembers.map((member) => ({
      ...member.toObject().user,
    }));

    res.status(200).json({
      status: "succes",
      message: `Group member ${actionType === "add" ? "added" : "removed"} successfully`,
      data: {
        group: {
          ...group?.toObject(),
          members: flattendMember,
        },
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
      message: "No group found with provided id",
    });

  if (String(group.admin) !== selfId)
    return next({
      statusCode: 403,
      message: "Only group admin can delete the group",
    });

  // when removing group, we must remove all messages that are relavant to this group

  // starting transaction session to apply all these
  const session = await mongoose.startSession();

  session.startTransaction();
  // delete group member
  await Member.deleteMany({ group: groupId });
  // delete the group itself
  await Group.findByIdAndDelete(groupId);

  //  delete message regarding to this group (later)
  await Message.deleteMany({ receiver: groupId });

  await session.commitTransaction();

  res.status(204).json({
    status: "success",
    message: "Group removed successfully",
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
