import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/auth"; // adjust to where your NextAuth config lives

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}