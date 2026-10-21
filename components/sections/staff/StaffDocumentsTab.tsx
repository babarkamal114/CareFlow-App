'use client';

import { ExternalLink, FileCheck2, FileText, FileWarning } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Button,
  Chip,
  EmptyState,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import { STAFF_DOCUMENT_TYPE_LABELS } from 'types';
import { formatStaffDate, groupStaffDocuments, hasStaffContract } from 'utils';

interface StaffDocumentsTabProps {
  profile: MockStaffProfile;
}

export function StaffDocumentsTab({ profile }: StaffDocumentsTabProps) {
  const { documents } = profile.data;
  const groups = groupStaffDocuments(documents);

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileText />}
        title="No documents uploaded"
        description="Upload the signed contract, ID, DBS certificate and training certificates so the file is audit ready."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          On File
        </p>
        <div className="flex flex-wrap gap-1.5">
          {groups.map((group) => (
            <Chip key={group.type} tone="success">
              <FileCheck2 className="size-3" />
              {STAFF_DOCUMENT_TYPE_LABELS[group.type]}
              <Badge variant="softMuted" shape="pill" badgeSize="sm">
                {group.documents.length}
              </Badge>
            </Chip>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={`${document.type}-${document.url}`}>
              <TableCell>
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-cf-ink-40" />
                  <span className="truncate font-semibold text-cf-ink">
                    {document.fileName || 'Untitled document'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="softInfo" shape="pill" badgeSize="sm">
                  {STAFF_DOCUMENT_TYPE_LABELS[document.type]}
                </Badge>
              </TableCell>
              <TableCell>{formatStaffDate(document.uploadedAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="xs"
                  nativeButton={false}
                  render={
                    <a href={document.url} target="_blank" rel="noreferrer" />
                  }
                >
                  Open
                  <ExternalLink className="size-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hasStaffContract(documents) ? null : (
        <Alert variant="error">
          <AlertIcon>
            <FileWarning />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Signed contract missing</AlertTitle>
            <AlertDescription>
              A signed employment contract is required for every care worker
              before they can be scheduled onto visits.
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}