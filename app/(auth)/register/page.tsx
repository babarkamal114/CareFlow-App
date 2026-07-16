import Link from "next/link";

export default function RegisterPage() {
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
      <Link
        href="/auth/login?screen_hint=signup"
        className="flex h-10 w-full items-center justify-center rounded-md bg-[#1a6b3c] text-sm font-medium text-white transition-all hover:bg-[#155c32]"
      >
        Create account
      </Link>
    </div>
  );
}