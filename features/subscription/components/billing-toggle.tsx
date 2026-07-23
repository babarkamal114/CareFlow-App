"use client";

import { motion } from "framer-motion";

export type BillingCycle = "monthly" | "annual";

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
      {(["monthly", "annual"] as const).map((cycle) => (
        <button
          key={cycle}
          type="button"
          onClick={() => onChange(cycle)}
          className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === cycle ? "text-white" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {value === cycle && (
            <motion.span
              layoutId="billing-toggle-pill"
              className="absolute inset-0 rounded-full bg-[#1a6b3c]"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {cycle === "monthly" ? "Monthly" : "Annual"}
            {cycle === "annual" && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  value === "annual" ? "bg-white/20 text-white" : "bg-[#1a6b3c]/10 text-[#1a6b3c]"
                }`}
              >
                Save 20%
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}