import mongoose from "mongoose";
import { z } from "zod";

export const groupSchema = z.object({
  name: z.string("Provide a group name"),
  profile: z.file().optional(),
  members: z
    .array(
      z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Please provide only valid user-id",
      })
    )
    .min(1)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Members array should not contain duplicates",
    }),
});

export type GroupInput = z.infer<typeof groupSchema>;
