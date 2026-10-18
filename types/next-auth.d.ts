// src/types/next-auth.d.ts

import { DefaultSession, DefaultJWT, DefaultUser } from "next-auth";


declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    accessToken?: string;
    refreshToken?: string;
    isEmailVerified?: boolean;
    hasActiveSubscription?: boolean;
    hasAgency? : boolean
    isAgencyOwner? : boolean;
    role? : string
    userType? : string
    agencyId? : string;
  }


  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isEmailVerified: boolean;
      hasActiveSubscription?: boolean;
      hasAgency? : boolean;
      role? : string;
      isAgencyOwner? : boolean;
      userType? : string
      agencyId? : string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    isEmailVerified?: boolean;
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    isEmailVerified?: boolean;
  }
}