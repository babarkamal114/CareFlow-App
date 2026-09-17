"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PricingCardsProps, BillingCycle } from "lib";
import {
  PRICING_PLANS,
  INCLUDED_IN_ALL,
  SINGLE_AGENCY_NOTE,
} from "lib";
import { BillingToggle, PricingCard } from "@/components/ui";
import { mapSubscriptionPlansToPricingPlans, useGetAllSubscriptionPlansApi } from "lib";
import { Loader } from "lucide-react";

export function PricingCards({ onSelectPlan }: PricingCardsProps) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const {data, error, isLoading} = useGetAllSubscriptionPlansApi()

  if(isLoading) return <> <Loader /></> 
  if (error) return <div>Failed to load plans</div>;
  if(data?.success !== true) return <>Couldnt Find Out Any Plans</>

  const pricingPlans = mapSubscriptionPlansToPricingPlans(data.plans)
  const filteredPlans = pricingPlans.filter((plan) => {
    if (cycle === "monthly") {
      return plan.monthlyPrice !== null;
    }
    return plan.annualPrice !== null;
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-center">
        <BillingToggle value={cycle} onChange={setCycle} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredPlans.map((plan, i) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            index={i}
            onSelect={onSelectPlan}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl bg-zinc-50 px-6 py-4 text-sm text-zinc-500"
      >
        <span className="font-medium text-zinc-700">
          Included in every plan:
        </span>
        {INCLUDED_IN_ALL.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}
