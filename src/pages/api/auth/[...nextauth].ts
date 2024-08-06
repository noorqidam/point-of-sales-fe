import axios, { AxiosError, AxiosResponse } from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { Alert } from "@/types/alert";
import { LoginResponse } from "@/types/auth/response";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        userAgent: {},
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const loginResponse: AxiosResponse<LoginResponse> = await axios.post(
            `${process.env.NEXT_PUBLIC_POS_API_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          return {
            id: `${loginResponse.data.data.user.id ?? 0}`,
            user: loginResponse.data.data.user,
            accessToken: loginResponse.data.data.accessToken,
            refreshToken: loginResponse.data.data.refreshToken,
            message: loginResponse.data.message.message,
            timeout: loginResponse.data.data.timeout,
          };
        } catch (error) {
          if (error instanceof AxiosError && error.response?.data.message) {
            const errorData: Alert = error.response.data.message;

            throw new Error(
              JSON.stringify({ error: errorData, status: false, ok: false })
            );
          }
          throw new Error(JSON.stringify({ error, status: false, ok: false }));
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // error: '/login',
    // signOut: '/user/logout',
  },
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {
      return { ...session, ...token };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
