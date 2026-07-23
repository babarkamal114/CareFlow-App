import { PricingCards } from "@/features/subscription/components/pricing-cards";

export default function SubscriptionOnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F9] px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-zinc-900">
          Choose your plan
        </h1>
        <p className="mt-2 text-zinc-500">
          Start your 14-day free trial. Change or cancel anytime.
        </p>
      </div>
      <div className="mt-12">
        <PricingCards />
      </div>
    </div>
  );
}