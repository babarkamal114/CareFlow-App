import "server-only";

import { redirect } from "next/navigation";
import { auth0 } from "lib";

export async function requireSession() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}