export interface PricingFeature {
  label: string;
}

export interface PricingPlan {
  id: "starter" | "professional" | "enterprise";
  name: string;
  tagline: string;
  monthlyPrice: number | null; // null = "Contact us"
  annualPrice: number | null;
  agencies: string;
  caregivers: string;
  serviceUsers: string;
  familyMembers: string;
  features: PricingFeature[];
  cta: string;
  highlighted?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Small care agencies getting started",
    monthlyPrice: 49,
    annualPrice: 499,
    agencies: "1 agency",
    caregivers: "Up to 10 caregivers",
    serviceUsers: "Up to 50 service users",
    familyMembers: "Up to 100 family members",
    features: [
      { label: "Scheduling & rota management" },
      { label: "Visit check-in/check-out" },
      { label: "Care plan records" },
      { label: "Email support" },
    ],
    cta: "Start with Starter",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Growing agencies with multiple locations",
    monthlyPrice: 99,
    annualPrice: 999,
    agencies: "1 agency",
    caregivers: "Up to 100 caregivers",
    serviceUsers: "Up to 500 service users",
    familyMembers: "Up to 1,000 family members",
    features: [
      { label: "Everything in Starter" },
      { label: "eMAR & medication management" },
      { label: "Route optimisation" },
      { label: "Family portal access" },
      { label: "Priority support" },
    ],
    cta: "Start with Professional",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Large care networks and national chains",
    monthlyPrice: null,
    annualPrice: null,
    agencies: "1 agency",
    caregivers: "Unlimited caregivers",
    serviceUsers: "Unlimited service users",
    familyMembers: "Unlimited family members",
    features: [
      { label: "Everything in Professional" },
      { label: "API access" },
      { label: "Dedicated account manager" },
      { label: "Custom onboarding" },
    ],
    cta: "Contact sales",
  },
];

export const INCLUDED_IN_ALL = [
  "CQC-aligned records",
  "UK data residency",
  "Bank-level encryption",
  "GDPR compliant",
];

/** Every plan currently allows exactly one agency per account. */
export const SINGLE_AGENCY_NOTE =
  "Each account can create one agency. Need multiple agencies? Contact sales.";