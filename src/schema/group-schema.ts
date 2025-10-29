import { z } from "zod";

export const groupSchema = z.object({
  name: z.string("Provide a group name"),
  profile: z.file().optional(),
  members: z.array(z.string()).min(1),
});

export default groupSchema;

export type GroupInput = z.infer<typeof groupSchema>;
