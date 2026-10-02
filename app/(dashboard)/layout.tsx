import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/features/layout";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // TEMP: bypassing auth check to work on dashboard UI without backend running
  // TODO: remove this before pushing/merging
  // if (!session?.user) {
  //   redirect("/login");
  // }
  return <DashboardShell>{children}</DashboardShell>;
}