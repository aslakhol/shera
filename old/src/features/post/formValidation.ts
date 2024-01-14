import { z } from "zod";

export type PostSchemaType = z.infer<typeof postSchema>;

export const postSchema = z.object({
  message: z.string(),
});
