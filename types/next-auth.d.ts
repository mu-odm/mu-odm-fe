import { UserRole } from "@/enum/UserRole";
import { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

  export interface Session {
    accessToken?: string;
    user?: User;
  }

  export interface User {
    id?: string;
    username?: string;
    email?: string;
    role?: string;
    region?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    exp?: number;
    iat?: number;
    jti?: string;
    user?: User;
  }
}