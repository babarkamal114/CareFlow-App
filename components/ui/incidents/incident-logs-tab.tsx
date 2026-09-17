'use client';

import { useState } from 'react';
import { Card, Button, Textarea, ScrollArea } from '@/components/ui';
import { User } from 'lucide-react';
import { Incident } from '@/types';

interface IncidentLogsTabProps {
  incident: Incident;
}

export function IncidentLogsTab({ incident }: IncidentLogsTabProps) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  return (
    <ScrollArea className="pr-4">
      <div className="space-y-4">
        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-3">Add Investigation Note</p>
          <Textarea
            placeholder="Document investigation progress, findings, actions taken..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="mb-2"
          />
          <Button
            size="sm"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="w-full"
          >
            Add Note
          </Button>
        </Card>

        <Card className="border-cf-border p-4">
          <p className="text-sm font-semibold text-cf-ink mb-4">Investigation Timeline</p>
          <div className="space-y-4">
            {incident.investigationNotes.map((note, i) => (
              <div key={i} className="pb-4 border-b border-cf-border-light last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-cf-primary/10 flex items-center justify-center">
                      <User className="h-3 w-3 text-cf-primary" />
                    </div>
                    <p className="text-xs font-medium text-cf-ink-80">{note.author}</p>
                  </div>
                  <p className="text-xs text-cf-ink-60">
                    {note.timestamp.toLocaleDateString()} {note.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm text-cf-ink ml-8">{note.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
}