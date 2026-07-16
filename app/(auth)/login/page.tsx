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
      <Link
        href="/auth/login"
        className="flex h-10 w-full items-center justify-center rounded-md bg-[#1a6b3c] text-sm font-medium text-white transition-all hover:bg-[#155c32]"
      >
        Sign in
      </Link>
    </div>
  );
}