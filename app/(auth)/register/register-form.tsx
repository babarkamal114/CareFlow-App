"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "ui-components";
import { Input } from "ui-components";
import { Label } from "ui-components";
import { NhsIcon } from "@/components/auth/nhs-icon";

const ROLES = [
  "Registered Manager", "Deputy Manager", "Care Coordinator",
  "Senior Carer", "Administrator", "Director / Owner",
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export interface RegisterFormProps {
  /** Injected by the page in prod; stub in Storybook */
  onSubmit?: (data: RegisterPayload) => Promise<{ error?: string | null }>;
  onNhsClick?: () => void;
}

export interface RegisterPayload {
  name: string; email: string; agency: string; password: string; role: string;
}

export function RegisterForm({ onSubmit, onNhsClick }: RegisterFormProps) {
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RegisterPayload>(
    { name: "", email: "", agency: "", password: "", role: "Registered Manager" }
  );

  function update(field: keyof RegisterPayload, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the Terms of Service and Privacy Policy"); return; }
    if (!onSubmit) return;
    setError(null);
    setPending(true);
    try {
      const res = await onSubmit(form);
      if (res?.error) setError(res.error);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-zinc-700">Full name</Label>
        <Input id="name" placeholder="Jane Smith" value={form.name} onChange={(e) => update("name", e.target.value)}
          required className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-sm font-medium text-zinc-700">Work email</Label>
        <Input id="reg-email" type="email" placeholder="jane@sunrisecare.co.uk" value={form.email}
          onChange={(e) => update("email", e.target.value)} required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="agency" className="text-sm font-medium text-zinc-700">Agency name</Label>
        <Input id="agency" placeholder="Sunrise Care Ltd" value={form.agency}
          onChange={(e) => update("agency", e.target.value)} required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
      </motion.div>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="reg-password" className="text-sm font-medium text-zinc-700">Password</Label>
        <div className="relative">
          <Input id="reg-password" type={showPw ? "text" : "password"} placeholder="••••••••"
            value={form.password} onChange={(e) => update("password", e.target.value)} required
            className="h-10 border-zinc-200 bg-white pr-10 text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-zinc-400">Min 8 characters · 1 uppercase · 1 number</p>
      </motion.div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="role" className="text-sm font-medium text-zinc-700">Your role</Label>
        <div className="relative">
          <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}
            className="h-10 w-full appearance-none rounded-md border border-zinc-200 bg-white px-3 pr-9 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] transition-all cursor-pointer">
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </motion.div>

      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex items-start gap-2">
        <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-[#1a6b3c] cursor-pointer" />
        <label htmlFor="terms" className="text-sm text-zinc-600 cursor-pointer leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-[#1a6b3c] hover:underline font-medium">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-[#1a6b3c] hover:underline font-medium">Privacy Policy</a>
        </label>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</motion.p>
      )}

      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="submit" disabled={pending}
          className="h-10 w-full bg-[#1a6b3c] hover:bg-[#155c32] text-white font-medium transition-all shadow-sm hover:shadow-md">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start free trial"}
        </Button>
      </motion.div>

      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" /><span className="text-xs text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </motion.div>

      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="button" variant="outline" onClick={onNhsClick}
          className="h-10 w-full border-zinc-200 bg-white text-zinc-700 font-medium hover:bg-zinc-50 transition-all gap-2">
          <NhsIcon />Sign up with NHS Identity
        </Button>
      </motion.div>

      <motion.p custom={9} variants={fadeUp} initial="hidden" animate="visible"
        className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-[#1a6b3c] hover:text-[#155c32] transition-colors">Sign in</a>
      </motion.p>
    </form>
  );
}
