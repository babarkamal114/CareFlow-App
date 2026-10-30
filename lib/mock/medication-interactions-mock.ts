import type { InteractionRule } from "types";

export const mockInteractionRules: InteractionRule[] = [
  { a: "warfarin", b: "aspirin", severity: "major", message: "Increased bleeding risk — review with the GP or anticoagulant clinic" },
  { a: "warfarin", b: "ibuprofen", severity: "major", message: "Increased bleeding risk — avoid NSAIDs with warfarin" },
  { a: "warfarin", b: "trimethoprim", severity: "major", message: "Trimethoprim can raise INR — monitor closely" },
  { a: "morphine", b: "lorazepam", severity: "major", message: "Additive sedation and respiratory depression" },
  { a: "oxycodone", b: "lorazepam", severity: "major", message: "Additive sedation and respiratory depression" },
  { a: "tramadol", b: "sertraline", severity: "major", message: "Risk of serotonin syndrome" },
  { a: "ramipril", b: "ibuprofen", severity: "moderate", message: "May reduce blood-pressure control and affect the kidneys" },
  { a: "furosemide", b: "ibuprofen", severity: "moderate", message: "NSAIDs can reduce the effect of furosemide" },
  { a: "levothyroxine", b: "adcal", severity: "moderate", message: "Calcium reduces absorption — give at least 4 hours apart" },
];

/** Allergy name -> drug names that count as a match. */
export const mockAllergyAliases: Record<string, string[]> = {
  penicillin: ["penicillin", "amoxicillin", "flucloxacillin", "co-amoxiclav"],
  aspirin: ["aspirin"],
  codeine: ["codeine", "co-codamol"],
  sulfonamides: ["sulfamethoxazole", "co-trimoxazole", "sulfasalazine"],
  latex: [],
};
