import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string | null; // NOTE: made "id" optional (?) and nullable (null) so that it matches types with ones already existing in DefaultSession
    } & DefaultSession["user"];
  }
}
