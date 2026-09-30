'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { FileText, Download, Upload, Calendar, User } from 'lucide-react';
import { cn } from 'lib';
import type { StaffMember } from 'types';
import {
  DOCUMENT_ACTIONS,
  DOCUMENT_UPLOAD_COPY,
  MOCK_STAFF_DOCUMENTS,
  buildDocumentStats,
  capitalizeDocumentStatus,
  formatDocumentDate,
  getDocumentPreviewRows,
  getDocumentStatusBadgeVariant,
  getDocumentStatusClasses,
  getDocumentTypeLabel,
  getStaggerDelay,
  isDocumentExpiringSoon,
  type DocumentActionId,
  type StaffDocument,
} from 'utils';

interface StaffDocumentsTabProps {
  staff: StaffMember;
}

export function StaffDocumentsTab({ staff }: StaffDocumentsTabProps) {
  const [selectedDocument, setSelectedDocument] = useState<StaffDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const documents = MOCK_STAFF_DOCUMENTS;
  const stats = buildDocumentStats(documents);

  const handlePreview = (doc: StaffDocument) => {
    setSelectedDocument(doc);
    setIsPreviewOpen(true);
  };

  const handleDownload = (doc: StaffDocument) => {
    console.log(`Downloading ${doc.name}`);
  };

  const handleDelete = (doc: StaffDocument) => {
    console.log(`Deleting ${doc.name}`);
  };

  const actionHandlers: Record<DocumentActionId, (doc: StaffDocument) => void> = {
    preview: handlePreview,
    download: handleDownload,
    delete: handleDelete,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: getStaggerDelay(index) }}
            className="rounded-lg border border-border bg-muted p-3"
          >
            <p className="mb-1 text-xs text-muted-foreground">{stat.label}</p>
            <p className={cn('text-2xl font-bold', stat.valueClassName)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Upload */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-all duration-200 hover:border-cf-ink-40 hover:bg-muted/80"
      >
        <Upload className="mx-auto mb-3 size-8 text-cf-ink-40" />
        <p className="mb-1 font-medium text-foreground">{DOCUMENT_UPLOAD_COPY.title}</p>
        <p className="text-sm text-muted-foreground">{DOCUMENT_UPLOAD_COPY.hint}</p>
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Documents ({documents.length})
        </h3>

        {documents.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: getStaggerDelay(index, 0.2) }}
            className={cn(
              'rounded-lg border p-4 transition-all duration-200 hover:shadow-sm',
              getDocumentStatusClasses(doc.status),
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-1 shrink-0 rounded-lg bg-card p-2.5">
                  <FileText className="size-5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-foreground">{doc.name}</p>
                    <Badge
                      variant={getDocumentStatusBadgeVariant(doc.status)}
                      badgeSize="sm"
                      shape="pill"
                    >
                      {capitalizeDocumentStatus(doc.status)}
                    </Badge>
                    {isDocumentExpiringSoon(doc.expiresAt) && doc.status !== 'expired' && (
                      <Badge variant="pastel-warning" badgeSize="sm" shape="pill">
                        Expiring soon
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      {getDocumentTypeLabel(doc.type)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatDocumentDate(doc.uploadedAt)}
                    </span>
                    {doc.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Expires: {formatDocumentDate(doc.expiresAt)}
                      </span>
                    )}
                    <span>{doc.size}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="size-3 text-cf-ink-40" />
                    <span>Uploaded by {doc.uploadedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {DOCUMENT_ACTIONS.map((action) => (
                  <Button
                    key={action.id}
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn('size-8 p-0', action.className)}
                    onClick={() => actionHandlers[action.id](doc)}
                    title={action.label}
                    aria-label={`${action.label} ${doc.name}`}
                  >
                    <action.icon className="size-4" />
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted p-8 text-center">
            <FileText className="mx-auto mb-4 size-16 text-cf-ink-40" />
            <p className="mb-4 text-sm text-muted-foreground">
              Document preview would appear here
            </p>
            <div className="space-y-2 text-left text-sm">
              {getDocumentPreviewRows(selectedDocument).map((row) => (
                <p key={row.label}>
                  <span className="font-medium text-foreground">{row.label}:</span>{' '}
                  <span className="text-muted-foreground">{row.value}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => selectedDocument && handleDownload(selectedDocument)}
            >
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}