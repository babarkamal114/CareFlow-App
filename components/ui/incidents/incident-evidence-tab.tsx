'use client';

import { Card, Button, ScrollArea } from '@/components/ui';
import { Download, Paperclip, Image, File, FileText } from 'lucide-react';
import { formatFileSize } from 'utils';


interface Evidence {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
}

const mockEvidence: Evidence[] = [
  {
    id: '1',
    name: 'incident-photo-1.jpg',
    type: 'image',
    url: '/images/incident-1.jpg',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-03-15T14:30:00'),
    size: 2450000,
  },
  {
    id: '2',
    name: 'witness-statement.pdf',
    type: 'document',
    url: '/documents/witness-statement.pdf',
    uploadedBy: 'Michael Chen',
    uploadedAt: new Date('2024-03-16T09:15:00'),
    size: 450000,
  },
];

const getFileIcon = (type: Evidence['type']) => {
  switch (type) {
    case 'image':
      return <Image className="h-4 w-4" />;
    case 'document':
      return <File className="h-4 w-4" />;
    case 'audio':
      return <FileText className="h-4 w-4" />;
    case 'video':
      return <FileText className="h-4 w-4" />;
    default:
      return <Paperclip className="h-4 w-4" />;
  }
};

export function IncidentEvidenceTab() {
  const evidence = mockEvidence;

  return (
    <ScrollArea className="pr-4">
      <div className="space-y-4">
        {evidence.length === 0 ? (
          <Card className="border-cf-border p-8 text-center">
            <Paperclip className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
            <p className="text-cf-ink-60">No evidence uploaded yet</p>
            <p className="text-xs text-cf-ink-40 mt-1">
              Upload photos, documents, audio, or video evidence
            </p>
          </Card>
        ) : (
          evidence.map((item) => (
            <Card key={item.id} className="border-cf-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cf-surface-muted flex items-center justify-center">
                    {getFileIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cf-ink">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-cf-ink-60">
                        {formatFileSize(item.size)}
                      </p>
                      <p className="text-xs text-cf-ink-60">
                        Uploaded by {item.uploadedBy}
                      </p>
                      <p className="text-xs text-cf-ink-60">
                        {item.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
}