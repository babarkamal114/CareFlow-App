'use client';

import { useState } from 'react';
import {
  Card,
  CardContent, 
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Input
} from 'ui-components';
import { Upload, X, FileText, ShieldAlert, Scale, FileHeart } from 'lucide-react';
import { PatientFormData } from './PatientCreateModal';

export const DOCUMENT_TYPES = [
  { value: 'capacity-assessment', label: 'Capacity Assessment' },
  { value: 'dnar', label: 'DNAR Order' },
  { value: 'poa', label: 'Power of Attorney' },
  { value: 'discharge-summary', label: 'Hospital Discharge Summary' },
  { value: 'care-plan', label: 'Care Plan' },
  { value: 'other', label: 'Other' },
] as const;

export const documentTypeIcon: Record<string, React.ReactNode> = {
  'capacity-assessment': <ShieldAlert className="w-5 h-5" />,
  dnar: <FileHeart className="w-5 h-5" />,
  poa: <Scale className="w-5 h-5" />,
  'discharge-summary': <FileText className="w-5 h-5" />,
  'care-plan': <FileText className="w-5 h-5" />,
  other: <FileText className="w-5 h-5" />,
};

export const documentTypeLabel = (value: string) =>
  DOCUMENT_TYPES.find((t) => t.value === value)?.label || 'Other';

interface AttachmentsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function AttachmentsStep({
  formData,
  setFormData,
}: AttachmentsStepProps) {
  const [docType, setDocType] = useState<string>('other');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        docType,
        file,
      }));
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newAttachments],
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((att:any) => att.id !== id),
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">Attachments</h3>
      <p className="text-sm text-cf-ink-60">
        Upload medical documents or files (optional) — capacity assessments,
        DNAR orders, Power of Attorney documentation, hospital discharge
        summaries, and more.
      </p>

      <div className="space-y-1">
        <Label htmlFor="docType" className="text-sm font-medium">
          Document Type
        </Label>
       <Select
        value={docType}
        onValueChange={(value) => setDocType(value ?? 'other')}
      >
          <SelectTrigger id="docType" className="border-cf-border">
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
        <p className="text-xs text-cf-ink-40">
          Applies to the next file(s) you upload below
        </p>
      </div>

      <Card className="border-2 border-dashed border-cf-border p-6 hover:border-cf-primary/50 transition-colors">
        <Label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="w-8 h-8 text-cf-ink-60" />
          <div className="text-center">
            <p className="text-sm font-medium text-cf-ink">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-cf-ink-60 mt-1">
              PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
          </div>
          <Input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
        </Label>
      </Card>

      {formData.attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cf-ink-60">
            Uploaded Files:
          </p>
          {formData.attachments.map((attachment:any) => (
            <Card key={attachment.id} className="border-cf-border p-3">
              <CardContent className="p-0 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cf-ink truncate">
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-cf-ink-60">
                    <span>{formatFileSize(attachment.size)}</span>
                    {attachment.docType && (
                      <>
                        <span>•</span>
                        <span>{documentTypeLabel(attachment.docType)}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="text-cf-ink-40 hover:text-cf-ink transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}