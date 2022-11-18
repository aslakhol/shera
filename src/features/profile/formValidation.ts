import { z } from "zod";

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});
