export const ADMINISTRATION_STATUS_VALUES = ["administered", "refused", "omitted", "not-available", "self-administered"] as const;
export const REASON_CODE_VALUES = ["patient-asleep", "nausea", "no-stock", "gp-instruction", "clinical-judgement", "patient-unwell", "other"] as const;
export const ROUTE_VALUES = ["oral", "topical", "inhaled", "injection", "eye-drops", "sublingual"] as const;
export const MEDICATION_TYPE_VALUES = ["regular", "prn", "controlled", "short-course", "variable-dose"] as const;
export const FREQUENCY_VALUES = ["once-daily", "twice-daily", "three-daily", "four-daily", "with-meals", "as-required"] as const;
export const EFFECTIVENESS_VALUES = ["effective", "partial", "not-effective"] as const;
export const CONTROLLED_ENTRY_KIND_VALUES = ["receipt", "disposal", "stock-check"] as const;

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
