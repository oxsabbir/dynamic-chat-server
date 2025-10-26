import * as zod from "zod";

export const userSchema = zod.object({
  fullName: zod.string("full name is required"),
  email: zod.email("email is required"),
  profile: zod.file().optional(),
  password: zod.string("password is required"),
});

export const loginSchema = zod.object({
  email: zod.email("email is required"),
  password: zod.string("password is required"),
});

export type LoginType = zod.infer<typeof loginSchema>;
export type UserInput = zod.infer<typeof userSchema>;
