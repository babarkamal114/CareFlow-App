import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "./config/env";
import { decodeJwt } from "jose";

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

          const decodedAccessToken = decodeJwt(data.accessToken);
          const decodedRefreshToken = decodeJwt(data.refreshToken);

          return {
            id: data.id,
            email: data.email,
            name: data.fullName,
            accessToken: data.accessToken,
            accessTokenExpires: decodedAccessToken.exp! * 1000,
            refreshToken: data.refreshToken,
            refreshTokenExpires: decodedRefreshToken.exp! * 1000,
            isEmailVerified: data.emailVerified,
            hasActiveSubscription: data.hasActiveSubscription,
            hasAgency: data.hasAgency,
            isAgencyOwner: data.isAgencyOwner,
            role: data.role,
            userType: data.userType,
            agencyId: data.agencyId,
          };
        } catch (error) {
          console.error("Authorize error:", error);
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
        token.accessTokenExpires = user.accessTokenExpires;
        token.refreshToken = user.refreshToken;
        token.refreshTokenExpires = user.refreshTokenExpires;
        token.isEmailVerified = user.isEmailVerified;
        token.hasActiveSubscription = user.hasActiveSubscription;
        token.role = user.role;
        token.userType = user.userType;
        token.isAgencyOwner = user.isAgencyOwner;
        token.hasAgency = user.hasAgency;
        token.agencyId = user.agencyId;
        return token;
      }

      if (
        token.refreshTokenExpires &&
        Date.now() > (token.refreshTokenExpires as number)
      ) {
        console.log("🔒 Refresh token expired — session invalidated");
        return { ...token, error: "RefreshAccessTokenError" };
      }

      if (
        token.id &&
        token.accessToken &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        try {
          const response = await fetch(`${BACKEND_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            const actualUser =
              responseData?.user?.user || responseData?.user || responseData;

            token.isEmailVerified =
              actualUser.isEmailVerified ??
              actualUser.emailVerified ??
              token.isEmailVerified;
            token.status = actualUser.status ?? token.status;
            token.email = actualUser.email ?? token.email;
            token.fullName = actualUser.fullName ?? token.fullName;
            token.hasActiveSubscription =
              actualUser.hasActiveSubscription ?? token.hasActiveSubscription;
            token.role = actualUser.role ?? token.role;
            token.userType = actualUser.userType ?? token.userType;
            token.isAgencyOwner =
              actualUser.isAgencyOwner ?? token.isAgencyOwner;
            token.hasAgency = actualUser.hasAgency ?? token.hasAgency;
            token.agencyId = actualUser.agencyId ?? token.agencyId;
          }
        } catch (error) {
          console.error("Error refreshing user data from /users/me:", error);
        }
        return token;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token.refreshToken }),
        });

        if (!res.ok) throw new Error("Refresh failed");

        const response = await res.json();
        const newAccessToken = response.data.accessToken;
        const decodedAccessToken = decodeJwt(newAccessToken);

        return {
          ...token,
          accessToken: newAccessToken,
          accessTokenExpires: decodedAccessToken.exp! * 1000,
          refreshToken: response.data.refreshToken ?? token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing access token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      if ((token as any).error) {
        (session as any).error = (token as any).error;
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.isEmailVerified = token.isEmailVerified as boolean;
        session.user.hasActiveSubscription =
          token.hasActiveSubscription as boolean;
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