import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    EmailProvider({
      server: {
        service: "SendGrid",
        auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
      },
      from: process.env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
  theme: {
    colorScheme: "light",
  },
});
