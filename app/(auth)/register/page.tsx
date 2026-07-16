"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { RegisterForm, type RegisterPayload } from "./register-form";

export default function RegisterPage() {
  const router = useRouter();

  async function handleSubmit(data: RegisterPayload) {
    // TODO: call your registration API here
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/");
    return { error: null };
  }

  async function handleNhs() {
    await signIn("demo", { callbackUrl: "/" });
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Start your free 14-day trial. No credit card required.
        </p>
      </div>
      <RegisterForm onSubmit={handleSubmit} onNhsClick={handleNhs} />
    </div>
  );
}
