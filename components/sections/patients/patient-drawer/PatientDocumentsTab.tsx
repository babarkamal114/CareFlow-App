'use client';

import { useRef, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { FileText, Upload, X, FolderOpen } from 'lucide-react';
import { usePatientDocuments } from 'hooks';
import {
  DEFAULT_PATIENT_DOCUMENT_TYPE,
  PATIENT_DOCUMENT_ACCEPT,
  PATIENT_DOCUMENT_TYPES,
  getDocumentMetaParts,
} from 'utils';
import { DotSeparated } from '../DotSeparated';

interface PatientDocumentsTabProps {
  patientId?: string;
}

function DocumentRowSkeleton() {
  return (
    <Card className="border-cf-border">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cf-ink-40/20 animate-pulse flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-48 rounded bg-cf-ink-40/20 animate-pulse" />
            <div className="h-3 w-40 rounded bg-cf-ink-40/20 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PatientDocumentsTab({ patientId }: PatientDocumentsTabProps) {
  const { documents, isLoading, error, refetch, addFiles, removeDocument } =
    usePatientDocuments(patientId);
  const [docType, setDocType] = useState<string>(DEFAULT_PATIENT_DOCUMENT_TYPE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      addFiles(Array.from(files), docType);
      e.currentTarget.value = '';
    }
  };

  const renderBody = () => {
    if (error) {
      return (
        <div className="flex items-center justify-between text-sm py-4">
          <span className="text-cf-ink-60">Couldn&apos;t load documents.</span>
          <button onClick={refetch} className="font-semibold text-cf-ink underline">
            Retry
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <DocumentRowSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="text-center py-8">
          <FolderOpen className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
          <p className="text-sm text-cf-ink-60">No documents uploaded</p>
          <p className="text-xs text-cf-ink-40 mt-1">
            Upload capacity assessments, DNAR orders, POA, or discharge summaries
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="border-cf-border hover:bg-cf-surface-muted/50 transition-colors"
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-cf-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-cf-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cf-ink truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-0.5">
                      <DotSeparated parts={getDocumentMetaParts(doc)} />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => removeDocument(doc.id)}
                  className="text-cf-ink-40 hover:text-cf-error transition-colors flex-shrink-0 p-1"
                  aria-label={`Remove ${doc.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-cf-ink">Document Type</label>
          <Select
            value={docType}
            onValueChange={(val) => setDocType(val ?? DEFAULT_PATIENT_DOCUMENT_TYPE)}
          >
            <SelectTrigger className="border-cf-border h-9">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {PATIENT_DOCUMENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          className="gap-1.5 h-9"
          disabled={isLoading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept={PATIENT_DOCUMENT_ACCEPT}
        />
      </div>

      {renderBody()}
    </div>
  );
}