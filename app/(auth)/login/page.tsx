// app/(auth)/login/page.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="space-y-7">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in to your CareFlow account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/auth/login"
          className="flex h-10 w-full items-center justify-center rounded-md bg-[#1a6b3c] text-sm font-medium text-white shadow-sm transition-all hover:bg-[#155c32] hover:shadow-md"
        >
          Sign in
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-center text-sm text-zinc-500"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-[#1a6b3c] hover:text-[#155c32] transition-colors">
          Sign up
        </Link>
      </motion.p>
    </div>
  );
}