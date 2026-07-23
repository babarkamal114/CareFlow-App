"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BillingToggle, type BillingCycle } from "./billing-toggle";
import { PricingCard } from "./pricing-card";
import { PRICING_PLANS, INCLUDED_IN_ALL } from "../pricing-data";

export interface PricingCardsProps {
  onSelectPlan?: (planId: string) => void;
}

export function PricingCards({ onSelectPlan }: PricingCardsProps) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-center">
        <BillingToggle value={cycle} onChange={setCycle} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan, i) => (
          <PricingCard key={plan.id} plan={plan} cycle={cycle} index={i} onSelect={onSelectPlan} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl bg-zinc-50 px-6 py-4 text-sm text-zinc-500"
      >
        <span className="font-medium text-zinc-700">Included in every plan:</span>
        {INCLUDED_IN_ALL.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}