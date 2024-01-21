import { z } from "zod";
import { asOptionalField } from "../../old/src/utils/zodForm";

export type AttendEventSchemaType = z.infer<typeof attendEventSchema>;

export const attendEventSchema = z.object({
  name: z
    .string()
    .min(1, "Must contain at least 1 character")
    .max(100, "Must contain less than 100 characters"),
  email: asOptionalField(z.string().email()),
});

export type PostSchemaType = z.infer<typeof postSchema>;

export const postSchema = z.object({
  message: z.string(),
});

export type EventSchemaType = z.infer<typeof eventSchema>;

export const eventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  dateTime: z.date(),
  place: z.string().optional(),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export const profileSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email().max(254),
  image: z
    .string()
    .url("Needs to be a valid url to a picture.")
    .or(z.literal(""))
    .optional(),
});
