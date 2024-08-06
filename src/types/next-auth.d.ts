import { DefaultSession } from "next-auth";

import { Alert } from "@/types/alert";
import { Timeout } from "@/types/auth/timeout";
import { User } from "@/types/auth/user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: User;
    accessToken: string;
    refreshToken: string;
    message?: Alert;
    timeout?: Timeout;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken` when using JWT sessions */
  interface JWT {
    user: User;
    accessToken: string;
    refreshToken: string;
    message?: Alert;
    timeout?: Timeout;
  }
}
