
import { signIn } from "next-auth/react";

export async function loginWithAuth0() {
  await signIn("auth0", { redirectTo: "/dashboard" });
}