import "server-only";

import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

export async function requireSession() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect("/login");  // <-- go to YOUR page first
  }
  return session;
}