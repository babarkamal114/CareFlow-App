"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PricingCardsProps, BillingCycle } from "lib";
import { BillingToggle, PricingCard, PricingCardsSkeleton } from "@/components/ui";
import { mapSubscriptionPlansToPricingPlans, useGetAllSubscriptionPlansApi } from "lib";

export function PricingCards({ onSelectPlan }: PricingCardsProps) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const {data, error, isLoading} = useGetAllSubscriptionPlansApi()

  if(isLoading) return <PricingCardsSkeleton /> 
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

      
    </div>
  );
}
