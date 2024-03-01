import { PrismaClient } from "@prisma/client";
import { customAlphabet } from "nanoid";

import { env } from "~/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export const nanoId = customAlphabet(alphabet, 8);
