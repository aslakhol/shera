import { z } from "zod";

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export const profileSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  image: z
    .string()
    .url("Needs to be a valid url to a picture.")
    .or(z.literal(""))
    .optional(),
});
