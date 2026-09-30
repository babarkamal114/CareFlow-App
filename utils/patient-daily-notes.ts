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

export type PatientNoteDomain =
  | 'mood'
  | 'nutrition'
  | 'personal-care'
  | 'mobility'
  | 'skin'
  | 'continence'
  | 'social'
  | 'concern';

export interface PatientDailyNote {
  id: string;
  date: string;
  time: string;
  author: string;
  domain: PatientNoteDomain;
  content: string;
  flagged?: boolean;
}

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

export const MOCK_DAILY_NOTES: PatientDailyNote[] = [
  {
    id: '1',
    date: '2024-03-15',
    time: '09:15',
    author: 'Sarah Johnson',
    domain: 'mood',
    content: 'Bright and chatty this morning, looking forward to her granddaughter visiting at the weekend.',
  },
  {
    id: '2',
    date: '2024-03-15',
    time: '09:20',
    author: 'Sarah Johnson',
    domain: 'nutrition',
    content: 'Ate full breakfast — porridge and tea. Good appetite today.',
  },
  {
    id: '3',
    date: '2024-03-15',
    time: '09:30',
    author: 'Sarah Johnson',
    domain: 'mobility',
    content: 'Used walking frame to move to the bathroom, steady but slow. No signs of unsteadiness.',
  },
  {
    id: '4',
    date: '2024-03-14',
    time: '18:05',
    author: 'Emma Williams',
    domain: 'skin',
    content: 'Small area of redness noted on left heel. Advised to monitor, no open skin.',
    flagged: true,
  },
  {
    id: '5',
    date: '2024-03-14',
    time: '18:10',
    author: 'Emma Williams',
    domain: 'concern',
    content: 'Patient mentioned feeling dizzy briefly when standing. Reported to coordinator for GP follow-up.',
    flagged: true,
  },
  {
    id: '6',
    date: '2024-03-13',
    time: '12:40',
    author: 'Sarah Johnson',
    domain: 'social',
    content: 'Enjoyed a long phone call with her son. Talked about the garden birds.',
  },
];

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

const DAILY_NOTE_FLAGGED_CLASS = 'border-l-4 border-l-amber-500';

export function getDailyNoteCardClass(note: PatientDailyNote): string {
  return `border-cf-border ${note.flagged ? DAILY_NOTE_FLAGGED_CLASS : ''}`;
}