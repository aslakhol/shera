import { asOptionalField } from "@/utils/zodForm";
import { z } from "zod";

export const attendEventSchema = z.object({
  name: z
    .string()
    .min(1, "Must contain at least 1 character")
    .max(100, "Must contain less than 100 characters"),
  email: asOptionalField(z.string().email()),
});
