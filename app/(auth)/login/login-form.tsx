"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "ui-components";
import { Input } from "ui-components";
import { Label } from "ui-components";
import { Checkbox } from "ui-components";
import { NhsIcon } from "@/components/auth/nhs-icon";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<{ error?: string | null }>;
  onNhsClick?: () => void;
}

export function LoginForm({ onSubmit, onNhsClick }: LoginFormProps) {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSubmit) return;
    setError(null);
    setPending(true);
    try {
      const res = await onSubmit(email, password);
      if (res?.error) setError("Invalid email or password");
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-zinc-700">Email address</Label>
        <Input id="email" type="email" placeholder="you@agency.co.uk" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</Label>
        <div className="relative">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} required
            className="h-10 border-zinc-200 bg-white pr-10 text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" className="border-zinc-300 data-[state=checked]:bg-[#1a6b3c] data-[state=checked]:border-[#1a6b3c]" />
          <label htmlFor="remember" className="text-sm text-zinc-600 cursor-pointer select-none">Remember me</label>
        </div>
        <a href="/forgot-password" className="text-sm font-medium text-[#1a6b3c] hover:text-[#155c32] transition-colors">
          Forgot password?
        </a>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</motion.p>
      )}

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="submit" disabled={pending}
          className="h-10 w-full bg-[#1a6b3c] hover:bg-[#155c32] text-white font-medium transition-all shadow-sm hover:shadow-md">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>
      </motion.div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" /><span className="text-xs text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </motion.div>

      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="button" variant="outline" onClick={onNhsClick} disabled={pending}
          className="h-10 w-full border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-all gap-2">
          <NhsIcon />Continue with NHS Identity
        </Button>
      </motion.div>

      <motion.p custom={6} variants={fadeUp} initial="hidden" animate="visible"
        className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <a href="/register" className="font-medium text-[#1a6b3c] hover:text-[#155c32] transition-colors">Sign up</a>
      </motion.p>
    </form>
  );
}
