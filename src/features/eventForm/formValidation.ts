import { z } from "zod";

export type EventSchemaType = z.infer<typeof eventSchema>;

export const eventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  time: z.string(),
  dateTime: z.string(),
  place: z.string().optional(),
});
