import { apiClient } from "../api";
import { PricingFeature, PricingPlan } from "../utils/components";
import { useApiMutation, useApiQuery } from "./use-api";
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query";

export interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number | null;
  maxAgencies: number;
  maxCarers: number | null;      
  maxServiceUsers: number | null; 
  maxFamilyMembers: number | null; 
  stripeProductId: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllSubscriptionsResponse {
    success : boolean;
    plans : SubscriptionPlan[]
}

export interface CreateCheckoutResponse {
    session: string;
    url: string
}

export interface CreateCheckoutVariables {
    planId: string;
    billingCycle : 'monthly' | 'yearly';
    accessToken: string
}

export function mapSubscriptionPlanToPricingPlan(
  plan: SubscriptionPlan
): PricingPlan {
  const isEnterprise = plan.slug === "enterprise";

  const features: PricingFeature[] = [
    { label: `${plan.maxCarers === null ? "Unlimited" : plan.maxCarers} caregivers` },
    { label: `${plan.maxServiceUsers === null ? "Unlimited" : plan.maxServiceUsers} patients` },
    { label: `${plan.maxFamilyMembers === null ? "Unlimited" : plan.maxFamilyMembers} family members` },
    { label: `${plan.maxAgencies} agency${plan.maxAgencies === 1 ? "" : "s"}` },
    { label: "24/7 support" },
  ];

  if (plan.slug === "professional") {
    features.push({ label: "Advanced analytics" });
    features.push({ label: "Priority support" });
  }

  if (plan.slug === "enterprise") {
    features.push({ label: "Custom integrations" });
    features.push({ label: "Dedicated account manager" });
    features.push({ label: "API access" });
  }

  return {
    id: plan.slug as "starter" | "professional" | "enterprise",
    planId: plan.id,
    name: plan.name,
    tagline: plan.description || "",
    monthlyPrice: plan.priceMonthly,
    annualPrice: plan.priceYearly,
    agencies: plan.maxAgencies === null ? "Unlimited" : String(plan.maxAgencies),
    caregivers: plan.maxCarers === null ? "Unlimited" : String(plan.maxCarers),
    serviceUsers:
      plan.maxServiceUsers === null ? "Unlimited" : String(plan.maxServiceUsers),
    familyMembers:
      plan.maxFamilyMembers === null ? "Unlimited" : String(plan.maxFamilyMembers),
    features,
    cta: isEnterprise ? "Contact Sales" : "Get Started",
    highlighted: plan.slug === "professional",
  };
}

export function mapSubscriptionPlansToPricingPlans(
  plans: SubscriptionPlan[]
): PricingPlan[] {
  return plans.map(mapSubscriptionPlanToPricingPlan);
}

const getAllSubscriptionPlansKeys = ['subscription', 'all'] as const
const createCheckoutKeys = ['subscription', 'checkout'] as const


export function useGetAllSubscriptionPlansApi(): UseQueryResult<GetAllSubscriptionsResponse, Error> {
    return useApiQuery<GetAllSubscriptionsResponse>(
        [...getAllSubscriptionPlansKeys],
        () => {
            return apiClient.get(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/get-all-plans`)
        }
    )
}

export function useCreateCheckoutApi(
    options? : Parameters<typeof useApiMutation<CreateCheckoutResponse , CreateCheckoutVariables>>[0]
){
    const queryClient = useQueryClient()
    return useApiMutation<CreateCheckoutResponse, CreateCheckoutVariables>({
        mutationKey: [...createCheckoutKeys],
        mutationFn: ({accessToken , billingCycle , planId}) => {
            return apiClient.post(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-checkout`, {
                planId,
                billingCycle
            },{
                Authorization: `Bearer ${accessToken}`
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [...createCheckoutKeys]
            })
        },
        showErrorToast: true,
        ...options
    })
}