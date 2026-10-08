export const FUNDING_SOURCE_VALUES = ["private", "local-authority", "nhs-chc"] as const;
export const PERIOD_TYPE_VALUES = ["weekly", "fortnightly", "monthly"] as const;
export const PAYMENT_METHOD_VALUES = ["card", "direct-debit", "bank-transfer"] as const;
export const DAY_TYPE_VALUES = ["weekday", "weekend", "bank-holiday", "unsocial"] as const;
export const DURATION_VALUES = [15, 30, 45, 60] as const;

export const MAX_PAYMENT_REFERENCE_LENGTH = 60;
export const MAX_VISIT_RATE = 500;