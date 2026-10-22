'use client';

import { useState } from 'react';
import { Button, Card, ScrollArea, Textarea } from '@/components/ui';
import { User } from 'lucide-react';
import { Incident } from 'types';
import { canSubmitNote, formatNoteTimestamp } from 'utils';

interface IncidentInvestigationTabProps {
  incident: Incident;
}

function FindingBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-cf-ink-60">{label}</p>
      <p className="text-sm text-cf-ink whitespace-pre-wrap">
        {value?.trim() ? value : 'Not recorded'}
      </p>
    </div>
  );
}

export function IncidentInvestigationTab({ incident }: IncidentInvestigationTabProps) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (canSubmitNote(newNote)) {
      setNewNote('');
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-260px)] pr-4">
      <div className="space-y-4 pb-4">
        <Card className="space-y-3 border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink">Findings</p>
          <FindingBlock label="Root cause" value={incident.rootCause} />
          <FindingBlock label="Preventive actions" value={incident.preventiveActions} />
          <FindingBlock label="Lessons learned" value={incident.lessonsLearned} />
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-3 text-sm font-semibold text-cf-ink">
            Add investigation note
          </p>
          <Textarea
            placeholder="Document investigation progress, findings, actions taken..."
            value={newNote}
            onChange={(event) => setNewNote(event.target.value)}
            rows={3}
            className="mb-2"
          />
          <Button
            size="sm"
            onClick={handleAddNote}
            disabled={!canSubmitNote(newNote)}
            className="w-full"
          >
            Add Note
          </Button>
        </Card>

        <Card className="border-cf-border p-4">
          <p className="mb-4 text-sm font-semibold text-cf-ink">
            Investigation timeline
          </p>
          <div className="space-y-4">
            {incident.investigationNotes.map((note) => (
              <div
                key={`${note.author}-${new Date(note.timestamp).getTime()}`}
                className="border-b border-cf-border-light pb-4 last:border-b-0"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-brand-50">
                      <User className="size-3 text-brand-600" />
                    </div>
                    <p className="text-xs font-medium text-cf-ink-80">{note.author}</p>
                  </div>
                  <p className="text-xs text-cf-ink-60">
                    {formatNoteTimestamp(note.timestamp)}
                  </p>
                </div>
                <p className="ml-8 text-sm text-cf-ink">{note.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}