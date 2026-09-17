// auth.ts
import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "./config/env";

const BACKEND_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class customAuthError extends CredentialsSignin {
  code!: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            credentials: "include",
          });

          let data;
          try {
            data = await response.json();
          } catch {
            throw new Error("invalid response from the server");
          }

          console.log("🔑 This is the raw data from backend : ", data);

          if (!response.ok) {
            const error = new customAuthError();
            error.code = data.message || data.error || "Login failed";
            throw error;
          }

          if (!data || !data.id || !data.email) {
            throw new Error("Invalid user data received from the server");
          }

  

          return {
            id: data.id,
            email: data.email,
            name: data.fullName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isEmailVerified: data.emailVerified,
            hasActiveSubscription: data.hasActiveSubscription,
            hasAgency: data.hasAgency,
            isAgencyOwner: data.isAgencyOwner,
            role: data.role,
            userType: data.userType,
            agencyId: data.agencyId
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      },
    }),
  ],

callbacks: {
  async jwt({ token, user }) {

    
    if (user) {
 
      token.id = user.id;
      token.accessToken = user.accessToken;
      token.refreshToken = user.refreshToken;
      token.isEmailVerified = user.isEmailVerified;
      token.hasActiveSubscription = user.hasActiveSubscription;
      token.role = user.role;
      token.userType = user.userType;
      token.isAgencyOwner = user.isAgencyOwner;
      token.hasAgency = user.hasAgency;
      token.agencyId = user.agencyId;

      return token;
    }

    if (token.id && token.accessToken) {

      try {
        const response = await fetch(`${BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });



        if (response.ok) {
          const responseData = await response.json();


          const actualUser = responseData?.user?.user || responseData?.user || responseData;

          token.isEmailVerified = actualUser.isEmailVerified ?? actualUser.emailVerified ?? token.isEmailVerified;
          token.status = actualUser.status ?? token.status;
          token.email = actualUser.email ?? token.email;
          token.fullName = actualUser.fullName ?? token.fullName;
          token.hasActiveSubscription = actualUser.hasActiveSubscription ?? token.hasActiveSubscription;
          token.role = actualUser.role ?? token.role;
          token.userType = actualUser.userType ?? token.userType;
          token.isAgencyOwner = actualUser.isAgencyOwner ?? token.isAgencyOwner;
          token.hasAgency = actualUser.hasAgency ?? token.hasAgency;
          token.agencyId = actualUser.agencyId ?? token.agencyId;


        } 
      } catch (error) {
        console.error('Error refreshing user data from /users/me:', error);

      }
    }
    
  
    return token;
  },
  async session({ session, token }) {
    
    if (session.user) {
      session.user.id = token.id as string;
      session.user.isEmailVerified = token.isEmailVerified as boolean;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.isEmailVerified = token.isEmailVerified as boolean;
      session.user.hasActiveSubscription = token.hasActiveSubscription as boolean;
      session.user.hasAgency = token.hasAgency as boolean;
      session.user.role = token.role as string;
      session.user.isAgencyOwner = token.isAgencyOwner as boolean;
      session.user.userType = token.userType as string;
      session.user.agencyId = token.agencyId as string;
    }

    return session;
  },
},
} satisfies NextAuthConfig);