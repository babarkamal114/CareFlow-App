"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Heart } from "lucide-react";

export interface AuthBrandPanelProps {
  pathname: string;
}

const PANEL_CONTENT: Record<
  string,
  { headline: string; sub?: string; features?: string[]; quote?: { text: string; author: string } }
> = {
  "/login": {
    headline: "Simplifying care,\nempowering teams.",
    sub: "The all-in-one platform for managing home care visits, compliance, and workforce — built for UK domiciliary care agencies.",
    quote: {
      text: "CareFlow cut our admin time by 60% and we passed our CQC inspection with Outstanding.",
      author: "Sarah Williams — Registered Manager, Sunrise Care",
    },
  },
  "/register": {
    headline: "Everything you need\nto run outstanding\ncare.",
    features: [
      "CQC-aligned compliance tracking",
      "Smart scheduling & route optimisation",
      "Real-time visit monitoring",
      "eMAR & medication management",
      "Family portal with live updates",
      "AI-powered insights & alerts",
    ],
    sub: "Trusted by 150+ UK care agencies",
  },
  "/forgot-password": {
    headline: "Your data,\nalways secure.",
    sub: "We take security seriously. Your account is protected with industry-leading encryption.",
  },
};

export function AuthBrandPanel({ pathname }: AuthBrandPanelProps) {
  const content = PANEL_CONTENT[pathname] ?? PANEL_CONTENT["/login"];

  return (
    <div className="relative hidden w-[42%] flex-col overflow-hidden bg-[#1a6b3c] lg:flex">
      {/* Subtle green gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.25)_0%,_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.07)_0%,_transparent_50%)]" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5" />

      {/* Logo */}
      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
            <Heart className="h-4 w-4 text-white" fill="white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none tracking-tight">CareFlow</p>
            <p className="text-[10px] text-white/60 uppercase tracking-widest leading-none mt-0.5">
              RPMC · HOME CARE PLATFORM
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-10 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h1 className="text-[2.1rem] font-bold leading-[1.15] tracking-tight text-white whitespace-pre-line">
              {content.headline}
            </h1>

            {content.sub && (
              <p className="text-sm leading-relaxed text-white/70 max-w-[280px]">{content.sub}</p>
            )}

            {content.features && (
              <ul className="space-y-2.5">
                {content.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                    className="flex items-center gap-2.5 text-sm text-white/85"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white/60" />
                    {f}
                  </motion.li>
                ))}
              </ul>
            )}

            {content.quote && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10"
              >
                <p className="text-sm text-white/90 leading-relaxed">
                  &ldquo;{content.quote.text}&rdquo;
                </p>
                <p className="mt-2 text-xs text-white/55">{content.quote.author}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
