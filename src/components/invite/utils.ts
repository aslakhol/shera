import { z } from "zod";

export const NetworkInviteFormSchema = z.object({
  friends: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
