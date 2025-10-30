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
    .min(1),
});

export type GroupInput = z.infer<typeof groupSchema>;
