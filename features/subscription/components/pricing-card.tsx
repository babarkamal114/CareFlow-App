"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { PricingPlan } from "../pricing-data";
import type { BillingCycle } from "./billing-toggle";

interface PricingCardProps {
  plan: PricingPlan;
  cycle: BillingCycle;
  index: number;
  onSelect?: (planId: PricingPlan["id"]) => void;
}

export function PricingCard({ plan, cycle, index, onSelect }: PricingCardProps) {
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: plan.highlighted ? -16 : -4 }}
      className={`relative flex flex-col rounded-2xl border p-6 transition-shadow duration-300 ${
        plan.highlighted
          ? "border-[#1a6b3c] bg-[#1a6b3c] text-white shadow-xl shadow-[#1a6b3c]/15 lg:-translate-y-3"
          : "border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-200/60"
      }`}
    >
      {plan.highlighted && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.08, type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1a6b3c] shadow-sm"
        >
          Most popular
        </motion.span>
      )}

      <h3 className={`font-heading text-lg font-bold ${plan.highlighted ? "text-white" : "text-zinc-900"}`}>
        {plan.name}
      </h3>
      <p className={`mt-1 text-sm ${plan.highlighted ? "text-white/70" : "text-zinc-500"}`}>
        {plan.tagline}
      </p>

      <div className="mt-5 flex h-10 items-baseline gap-1 overflow-hidden">
        {price !== null ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${plan.id}-${cycle}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-1"
            >
              <span className={`text-3xl font-bold tabular-nums ${plan.highlighted ? "text-white" : "text-zinc-900"}`}>
                £{price}
              </span>
              <span className={`text-sm ${plan.highlighted ? "text-white/60" : "text-zinc-400"}`}>
                {cycle === "monthly" ? "/mo" : "/year"}
              </span>
            </motion.div>
          </AnimatePresence>
        ) : (
          <span className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-zinc-900"}`}>
            Contact us
          </span>
        )}
      </div>

     <div className={`mt-4 space-y-1 border-t pt-4 text-sm ${plan.highlighted ? "border-white/15 text-white/80" : "border-zinc-100 text-zinc-600"}`}>
        <p>{plan.agencies}</p>
        <p>{plan.caregivers}</p>
        <p>{plan.serviceUsers}</p>
        <p>{plan.familyMembers}</p>
      </div>
      
      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((f, fi) => (
          <motion.li
            key={f.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.08 + fi * 0.05, duration: 0.3 }}
            className={`flex items-start gap-2 text-sm ${plan.highlighted ? "text-white/90" : "text-zinc-700"}`}
          >
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-white/70" : "text-[#1a6b3c]"}`} />
            {f.label}
          </motion.li>
        ))}
      </ul>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect?.(plan.id)}
        className={`mt-6 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
          plan.highlighted
            ? "bg-white text-[#1a6b3c] hover:bg-zinc-50"
            : "bg-[#1a6b3c] text-white hover:bg-[#155c32]"
        }`}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  );
}