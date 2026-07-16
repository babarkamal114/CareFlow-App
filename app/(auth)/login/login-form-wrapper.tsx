"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginForm } from "./login-form";

export function LoginFormWrapper() {
  const router = useRouter();

  async function handleSubmit(email: string, password: string) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!result?.error) {
      router.push("/");
      router.refresh();
    }
    return { error: result?.error ?? null };
  }

  async function handleNhsClick() {
    await signIn("demo", { callbackUrl: "/" });
  }

  return (
    <LoginForm onSubmit={handleSubmit} onNhsClick={handleNhsClick} />
  );
}
