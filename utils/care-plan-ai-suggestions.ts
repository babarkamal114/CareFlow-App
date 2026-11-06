// utils/care-plan-ai-suggestions.ts
//
// Pattern-detection over visit notes, producing care plan update suggestions —
// this is the real logic described in blueprint §3.1.2 ("the system analyses
// visit notes over time and suggests care plan adjustments"). The mock part
// is the VISIT NOTE DATA below, not the detection logic itself: swap
// `mockVisitNotes` for a real visit-notes query and this function works
// unchanged. A genuine AI/LLM call could later replace `detectPatterns`
// entirely, but rule-based detection already satisfies the blueprint's
// example case and needs no backend.

export type VisitNoteTag =
  | 'refused-meal'
  | 'refused-medication'
  | 'declined-personal-care'
  | 'missed-mobility-exercise'
  | 'low-mood'
  | 'skin-concern-noted';

export interface VisitNote {
  id: string;
  patientId: string;
  visitDate: string;
  tags: VisitNoteTag[];
}

export interface CarePlanSuggestion {
  id: string;
  patientId: string;
  patientName: string;
  module: 'nutrition' | 'medication' | 'personal-care' | 'mobility' | 'mental-health';
  occurrences: number;
  totalVisits: number;
  message: string;
  suggestion: string;
  severity: 'info' | 'warning';
}

// Mock visit history — replace with a real visit-notes query.
// Each patient has ~14 recent visits; tags simulate what a carer logged.
export const mockVisitNotes: VisitNote[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `vn-dc-${i}`,
    patientId: 'P-12345',
    visitDate: `2024-03-${String(1 + i).padStart(2, '0')}`,
    tags: (i % 14 < 8 && i % 2 === 0 ? ['refused-meal'] : []) as VisitNoteTag[],
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `vn-jo-${i}`,
    patientId: 'P-12346',
    visitDate: `2024-03-${String(1 + i).padStart(2, '0')}`,
    tags: (i < 5 ? ['refused-medication'] : []) as VisitNoteTag[],
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `vn-em-${i}`,
    patientId: 'P-12347',
    visitDate: `2024-03-${String(1 + i).padStart(2, '0')}`,
    tags: (i % 3 === 0 ? ['low-mood'] : []) as VisitNoteTag[],
  })),
];

const TAG_RULES: Record<
  VisitNoteTag,
  { module: CarePlanSuggestion['module']; threshold: number; buildMessage: (occ: number, total: number) => string; buildSuggestion: () => string; severity: CarePlanSuggestion['severity'] }
> = {
  'refused-meal': {
    module: 'nutrition',
    threshold: 6,
    buildMessage: (occ, total) => `Patient has refused meals on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Consider updating the nutrition plan and involving the GP or a dietitian',
    severity: 'warning',
  },
  'refused-medication': {
    module: 'medication',
    threshold: 4,
    buildMessage: (occ, total) => `Medication was refused on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Review the medication plan with the prescriber — consider timing, formulation, or an adherence conversation',
    severity: 'warning',
  },
  'declined-personal-care': {
    module: 'personal-care',
    threshold: 4,
    buildMessage: (occ, total) => `Personal care was declined on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Revisit personal care preferences — timing or approach may need adjusting',
    severity: 'info',
  },
  'missed-mobility-exercise': {
    module: 'mobility',
    threshold: 4,
    buildMessage: (occ, total) => `Mobility exercises were skipped on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Check in with physiotherapy — the current exercise plan may not be sustainable',
    severity: 'info',
  },
  'low-mood': {
    module: 'mental-health',
    threshold: 3,
    buildMessage: (occ, total) => `Low mood was noted on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Consider a wellbeing check-in and reviewing the mental health support plan',
    severity: 'warning',
  },
  'skin-concern-noted': {
    module: 'personal-care',
    threshold: 3,
    buildMessage: (occ, total) => `Skin concerns were logged on ${occ} of the last ${total} visits`,
    buildSuggestion: () => 'Flag for a skin integrity/pressure-area review',
    severity: 'warning',
  },
};

export function generateCarePlanSuggestions(
  visitNotes: VisitNote[],
  patientNames: Record<string, string>,
): CarePlanSuggestion[] {
  const byPatient = visitNotes.reduce<Record<string, VisitNote[]>>((acc, note) => {
    (acc[note.patientId] ||= []).push(note);
    return acc;
  }, {});

  const suggestions: CarePlanSuggestion[] = [];

  for (const [patientId, notes] of Object.entries(byPatient)) {
    const totalVisits = notes.length;
    const tagCounts: Partial<Record<VisitNoteTag, number>> = {};

    for (const note of notes) {
      for (const tag of note.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    for (const [tag, count] of Object.entries(tagCounts) as [VisitNoteTag, number][]) {
      const rule = TAG_RULES[tag];
      if (count >= rule.threshold) {
        suggestions.push({
          id: `sugg-${patientId}-${tag}`,
          patientId,
          patientName: patientNames[patientId] || patientId,
          module: rule.module,
          occurrences: count,
          totalVisits,
          message: rule.buildMessage(count, totalVisits),
          suggestion: rule.buildSuggestion(),
          severity: rule.severity,
        });
      }
    }
  }

  return suggestions;
}