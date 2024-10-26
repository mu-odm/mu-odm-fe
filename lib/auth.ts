import type { AuthOptions, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axiosInstance from "./axiosInstance";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const res = await axiosInstance.post("/api/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });
          if (res.status === 200) {
            return res.status === 200 ? res.data : null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?.email) {
        return { ...token, ...user };
      }

      return { ...token, ...user };
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const accessTokenData = JSON.parse(
        atob(token?.accessToken!.split(".")[1])
      );
      session.user = accessTokenData;
      token.accessTokenExpires = accessTokenData.exp;

      session.accessToken = token?.accessToken;

      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/home/login",
  },
};
