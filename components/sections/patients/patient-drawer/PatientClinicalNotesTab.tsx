'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Badge } from "@/components/ui";
import { FileClock, Plus, Sparkles } from 'lucide-react';
import {
  DAILY_NOTE_DOMAIN_META,
  MOCK_DAILY_NOTES,
  formatDailyNoteDate,
  getDailyNoteCardClass,
  getDailyNotesSummary,
  groupDailyNotesByDate,
  type PatientDailyNote,
} from 'utils';

export function PatientClinicalNotesTab() {
  const [notes] = useState<PatientDailyNote[]>(MOCK_DAILY_NOTES);

  const groups = groupDailyNotesByDate(notes);

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
          <span>{getDailyNotesSummary(notes)}</span>
        </div>
        <Button size="sm" className="gap-1.5 ml-3 flex-shrink-0">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {groups.map(({ date, notes: dayNotes }) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-cf-ink mb-2">{formatDailyNoteDate(date)}</h4>
          <div className="space-y-2">
            {dayNotes.map((note) => {
              const { Icon, label } = DAILY_NOTE_DOMAIN_META[note.domain];

              return (
                <Card key={note.id} className={getDailyNoteCardClass(note)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="pastel-info" className="text-[10px] gap-1" shape="pill">
                          <Icon className="h-3.5 w-3.5" />
                          {label}
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}