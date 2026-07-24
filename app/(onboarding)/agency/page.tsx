"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { AgencyForm, type AgencyFormPayload } from "@/features/onboarding/agency-form";

export default function AgencyOnboardingPage() {
  const router = useRouter();

  async function handleSubmit(data: AgencyFormPayload) {
    await new Promise((r) => setTimeout(r, 1200));
    setTimeout(() => router.push("/"), 1500);
    return { error: null };
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F7F9] px-6 py-16">
      {/* Ambient background shapes — subtle, sets a "settling in" mood without stealing focus */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1a6b3c]/5 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#1a6b3c]/5 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400"
        >
          <motion.span
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-[#1a6b3c]"
          />
          <span>Subscription</span>
          <span>→</span>
          <span className="text-[#1a6b3c]">Agency details</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a6b3c]/10"
          >
            <Building2 className="h-5 w-5 text-[#1a6b3c]" />
          </motion.div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900">
            Set up your agency
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Tell us about your agency so we can get you started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <AgencyForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </div>
  );
}