import { PricingCards } from "@/features/subscription/components/pricing-cards";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-zinc-900">
          Simple pricing for every agency
        </h1>
        <p className="mt-3 text-lg text-zinc-500">
          No hidden fees. No long-term contracts. Cancel anytime.
        </p>
      </div>
      <div className="mt-16">
        <PricingCards />
      </div>
    </div>
  );
}