export const TRAINING_MODULES = [
  "Safeguarding",
  "Medication",
  "First Aid",
  "Moving & Handling",
  "Fire Safety",
  "Infection Control",
] as const;

export type TrainingModule = (typeof TRAINING_MODULES)[number];
