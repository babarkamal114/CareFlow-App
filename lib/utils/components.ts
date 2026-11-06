// Subscription types
export interface PricingFeature {
  label: string;
}

export interface PricingPlan {
  id: "starter" | "professional" | "enterprise";
  planId: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  agencies: string;
  caregivers: string;
  serviceUsers: string;
  familyMembers: string;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
}

export type BillingCycle = "monthly" | "yearly";

export interface PricingCardProps {
  plan: PricingPlan;
  cycle: BillingCycle;
  index: number;
  onSelect?: (planId: PricingPlan["id"]) => void;
}

export interface PricingCardsProps {
  onSelectPlan?: (planId: string) => void;
}

// Onboarding types
export interface AgencyFormPayload {
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  postcode: string;
  type: string;
  locations: string;
}

export interface AgencyFormProps {
  onSubmit?: (data: AgencyFormPayload) => Promise<{ error?: string | null }>;
}