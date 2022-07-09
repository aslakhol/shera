import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  time: z.string(),
  place: z.string().optional(),
});
