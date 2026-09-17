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

const DOCUMENT_TYPES = [
  { value: 'capacity-assessment', label: 'Capacity Assessment' },
  { value: 'dnar', label: 'DNAR Order' },
  { value: 'poa', label: 'Power of Attorney' },
  { value: 'discharge-summary', label: 'Hospital Discharge Summary' },
  { value: 'care-plan', label: 'Care Plan' },
  { value: 'medication-list', label: 'Medication List' },
  { value: 'other', label: 'Other' },
] as const;

const documentTypeLabel = (value: string) =>
  DOCUMENT_TYPES.find((t) => t.value === value)?.label || 'Other';

interface DocumentItem {
  id: string;
  name: string;
  docType: string;
  uploadedDate: string;
  size: string;
}

const initialDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'Care Plan - March 2024',
    docType: 'care-plan',
    uploadedDate: '2024-03-01',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Hospital Discharge Summary - Jan 2024',
    docType: 'discharge-summary',
    uploadedDate: '2024-01-15',
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Medication List - Current',
    docType: 'medication-list',
    uploadedDate: '2024-03-10',
    size: '456 KB',
  },
  {
    id: '4',
    name: 'Power of Attorney - Registered',
    docType: 'poa',
    uploadedDate: '2024-02-15',
    size: '892 KB',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function PatientDocumentsTab() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [docType, setDocType] = useState<string>('other');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const newDocs: DocumentItem[] = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        docType,
        uploadedDate: new Date().toISOString().slice(0, 10),
        size: formatFileSize(file.size),
      }));
      setDocuments((prev) => [...newDocs, ...prev]);
      e.currentTarget.value = '';
    }
  };

  const handleRemove = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-cf-ink">Document Type</label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="border-cf-border h-9">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((t) => (
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
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
          <p className="text-sm text-cf-ink-60">No documents uploaded</p>
          <p className="text-xs text-cf-ink-40 mt-1">
            Upload capacity assessments, DNAR orders, POA, or discharge summaries
          </p>
        </div>
      ) : (
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
                        <span>{documentTypeLabel(doc.docType)}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedDate).toLocaleDateString('en-GB')}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(doc.id)}
                    className="text-cf-ink-40 hover:text-cf-error transition-colors flex-shrink-0 p-1"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
