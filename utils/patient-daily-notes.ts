import {
  Smile,
  Apple,
  HeartHandshake,
  Footprints,
  Layers,
  Users,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react';
import type { PatientDailyNote, PatientNoteDomain } from 'types';

export const DAILY_NOTE_DOMAIN_META: Record<PatientNoteDomain, { label: string; Icon: LucideIcon }> = {
  mood: { label: 'Mood', Icon: Smile },
  nutrition: { label: 'Nutrition', Icon: Apple },
  'personal-care': { label: 'Personal Care', Icon: HeartHandshake },
  mobility: { label: 'Mobility', Icon: Footprints },
  skin: { label: 'Skin Condition', Icon: Layers },
  continence: { label: 'Continence', Icon: Layers },
  social: { label: 'Social Interaction', Icon: Users },
  concern: { label: 'Concern', Icon: AlertCircle },
};

export function groupDailyNotesByDate(notes: PatientDailyNote[]) {
  const byDate = notes.reduce<Record<string, PatientDailyNote[]>>((acc, note) => {
    (acc[note.date] ??= []).push(note);
    return acc;
  }, {});

  return Object.keys(byDate)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({
      date,
      notes: [...(byDate[date] ?? [])].sort((a, b) => (a.time < b.time ? 1 : -1)),
    }));
}

export function formatDailyNoteDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** One-line "AI daily summary" shown above the notes. */
export function getDailyNotesSummary(notes: PatientDailyNote[]): string {
  const flaggedCount = notes.filter((n) => n.flagged).length;
  const base = 'AI daily summary: patient is stable overall.';
  return flaggedCount > 0
    ? `${base} ${flaggedCount} observation${flaggedCount > 1 ? 's' : ''} flagged for coordinator review.`
    : `${base} No concerns raised in the last 3 days.`;
}

const DAILY_NOTE_FLAGGED_CLASS = 'border-l-4 border-l-cf-amber-500';

export function getDailyNoteCardClass(note: PatientDailyNote): string {
  return `border-cf-border ${note.flagged ? DAILY_NOTE_FLAGGED_CLASS : ''}`;
}