import * as zod from "zod";

export const userSchema = zod.object({
  fullName: zod.string("Fullname is required").max(25),
  email: zod.email("Email is required"),
  profile: zod.file(),
  password: zod.string("Password is required"),
});

export const loginSchema = userSchema.pick({ email: true, password: true });

export type LoginType = zod.infer<typeof loginSchema>;
export type UserInput = zod.infer<typeof userSchema>;
