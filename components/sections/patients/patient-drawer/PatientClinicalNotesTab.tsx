'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import {
  Smile,
  Apple,
  HeartHandshake,
  Footprints,
  Layers,
  Users,
  AlertCircle,
  Plus,
  FileClock,
  Sparkles,
} from 'lucide-react';

type NoteDomain =
  | 'mood'
  | 'nutrition'
  | 'personal-care'
  | 'mobility'
  | 'skin'
  | 'continence'
  | 'social'
  | 'concern';

interface DailyNote {
  id: string;
  date: string;
  time: string;
  author: string;
  domain: NoteDomain;
  content: string;
  flagged?: boolean;
}

const DOMAIN_META: Record<NoteDomain, { label: string; icon: React.ReactNode }> = {
  mood: { label: 'Mood', icon: <Smile className="h-3.5 w-3.5" /> },
  nutrition: { label: 'Nutrition', icon: <Apple className="h-3.5 w-3.5" /> },
  'personal-care': { label: 'Personal Care', icon: <HeartHandshake className="h-3.5 w-3.5" /> },
  mobility: { label: 'Mobility', icon: <Footprints className="h-3.5 w-3.5" /> },
  skin: { label: 'Skin Condition', icon: <Layers className="h-3.5 w-3.5" /> },
  continence: { label: 'Continence', icon: <Layers className="h-3.5 w-3.5" /> },
  social: { label: 'Social Interaction', icon: <Users className="h-3.5 w-3.5" /> },
  concern: { label: 'Concern', icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

const mockNotes: DailyNote[] = [
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

export function PatientClinicalNotesTab() {
  const [notes] = useState<DailyNote[]>(mockNotes);

  const groupedByDate = notes.reduce<Record<string, DailyNote[]>>((acc, note) => {
    acc[note.date] = acc[note.date] || [];
    acc[note.date].push(note);
    return acc;
  }, {});

  const dates = Object.keys(groupedByDate).sort((a, b) => (a < b ? 1 : -1));
  const flaggedCount = notes.filter((n) => n.flagged).length;

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileClock className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
        <p className="text-sm text-cf-ink-60">No daily notes recorded yet</p>
        <p className="text-xs text-cf-ink-40 mt-1">
          Notes recorded during visits will appear here, grouped by care domain
        </p>
        <Button size="sm" className="gap-1.5 mt-4">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-cf-ink-60 bg-cf-surface-muted rounded-lg px-3 py-2 flex-1">
          <Sparkles className="h-3.5 w-3.5 text-cf-primary flex-shrink-0" />
          <span>
            AI daily summary: patient is stable overall.
            {flaggedCount > 0
              ? ` ${flaggedCount} observation${flaggedCount > 1 ? 's' : ''} flagged for coordinator review.`
              : ' No concerns raised in the last 3 days.'}
          </span>
        </div>
        <Button size="sm" className="gap-1.5 ml-3 flex-shrink-0">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {dates.map((date) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-cf-ink mb-2">
            {new Date(date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h4>
          <div className="space-y-2">
            {groupedByDate[date]
              .sort((a, b) => (a.time < b.time ? 1 : -1))
              .map((note) => (
                <Card
                  key={note.id}
                  className={`border-cf-border ${note.flagged ? 'border-l-4 border-l-amber-500' : ''}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="pastel-info" className="text-[10px] gap-1" shape="pill">
                          {DOMAIN_META[note.domain].icon}
                          {DOMAIN_META[note.domain].label}
                        </Badge>
                        {note.flagged && (
                          <Badge variant="pastel-warning" className="text-[10px]" shape="pill">
                            Flagged
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-cf-ink-40 flex-shrink-0">
                        {note.time} • {note.author}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-cf-ink-60 leading-relaxed">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
