import { z } from "zod";

export const zStringToNumber = z.string().transform(Number);
