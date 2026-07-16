"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // Resolve pathname here so AuthBrandPanel stays a pure prop-driven component
  // (no next/navigation dependency — fully testable in Storybook)
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      <AuthBrandPanel pathname={pathname} />

      {/* Right white form panel */}
      <div className="relative flex flex-1 items-center justify-center px-8 py-12 lg:px-16">
        {/* Subtle background texture */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,139,73,0.04)_0%,_transparent_60%)]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px]"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-400">
          © 2026 CareFlow ·{" "}
          <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
          {" · "}
          <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
        </p>
      </div>
    </div>
  );
}
