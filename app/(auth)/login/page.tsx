import { Button } from "@/components/ui";
import { LoginFormWrapper } from "./login-form-wrapper";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in to your CareFlow account
        </p>
      </div>
      <Button>
        <Link href={'/auth/login'}>
        Sign in 
        </Link>
      </Button>
      {/* <LoginFormWrapper /> */}
    </div>
  );
}
