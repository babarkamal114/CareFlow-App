"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, type ReactElement } from "react";
import { Button } from 'ui-components'

export function LoginForm(): ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleDemoSignIn() {
    setError(null);
    setPending(true);
    try {
      const result = await signIn("demo", {
        email: "demo@careflow.test",
        password: "demo",
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        className="w-full"
        disabled={pending}
        onClick={() => void handleDemoSignIn()}
      >
        Continue with demo account
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
