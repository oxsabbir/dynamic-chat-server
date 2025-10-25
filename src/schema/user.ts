import * as zod from "zod";

export const userSchema = zod.object({
  fullName: zod.string("full name is required"),
  email: zod.email("email is required"),
  profile: zod.file().optional(),
  password: zod.string("password is required"),
});

export type User = zod.infer<typeof userSchema>;
