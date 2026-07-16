"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState } from "react";

import { Button } from "ui-components";
import { Input } from "ui-components";
import { Label } from "ui-components";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPending(false);
    setSent(true);
  }

  return (
    <AnimatePresence mode="wait">
      {!sent ? (
        <motion.form key="form" onSubmit={(e) => void handleSubmit(e)} className="space-y-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
          {/* Icon */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6b3c]/10">
            <Mail className="h-5 w-5 text-[#1a6b3c]" />
          </motion.div>

          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-sm font-medium text-zinc-700">
              Email address
            </Label>
            <Input id="reset-email" type="email" placeholder="you@agency.co.uk" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all" />
            <p className="text-xs text-zinc-400">
              We&apos;ll send a password reset link to this address.
            </p>
          </motion.div>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <Button type="submit" disabled={pending}
              className="h-10 w-full bg-[#1a6b3c] hover:bg-[#155c32] active:bg-[#0f4425] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </Button>
          </motion.div>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <a href="/login"
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors w-fit">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </a>
          </motion.div>
        </motion.form>
      ) : (
        <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 rounded-xl bg-green-50 border border-green-100 p-6 text-center">
          <div className="flex justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}>
              <CheckCircle2 className="h-10 w-10 text-[#1a6b3c]" />
            </motion.div>
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Check your inbox</p>
            <p className="mt-1 text-sm text-zinc-500">
              We sent a reset link to <span className="font-medium text-zinc-700">{email}</span>
            </p>
          </div>
          <a href="/login" className="block text-sm font-medium text-[#1a6b3c] hover:text-[#155c32] transition-colors">
            Back to sign in
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
