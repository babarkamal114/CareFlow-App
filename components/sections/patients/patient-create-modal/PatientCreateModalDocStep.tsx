'use client';

import { useState, type ReactNode } from 'react';
import {
  Card,
  Label,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Upload, X } from 'lucide-react';
import {
  DEFAULT_PATIENT_DOCUMENT_TYPE,
  PATIENT_ATTACHMENT_ICONS,
  PATIENT_ATTACHMENT_TYPES,
  PATIENT_DOCUMENT_ACCEPT,
  buildPatientAttachments,
  getAttachmentMetaParts,
  getDocumentTypeLabel,
  removePatientAttachment,
  type PatientFormData,
} from 'utils';
import { DotSeparated } from '../DotSeparated';

export const DOCUMENT_TYPES = PATIENT_ATTACHMENT_TYPES;
export const documentTypeLabel = getDocumentTypeLabel;
export const documentTypeIcon: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(PATIENT_ATTACHMENT_ICONS).map(([value, Icon]) => [
    value,
    <Icon key={value} className="w-5 h-5" />,
  ])
);

interface AttachmentsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function AttachmentsStep({
  formData,
  setFormData,
}: AttachmentsStepProps) {
  const [docType, setDocType] = useState<string>(DEFAULT_PATIENT_DOCUMENT_TYPE);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...buildPatientAttachments(Array.from(files), docType)],
      });
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setFormData({
      ...formData,
      attachments: removePatientAttachment(formData.attachments, id),
    });
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
        <Select value={docType} onValueChange={setDocType}>
          <SelectTrigger id="docType" className="border-cf-border">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {PATIENT_ATTACHMENT_TYPES.map((t) => (
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
        <label className="flex flex-col items-center gap-2 cursor-pointer">
          <Upload className="w-8 h-8 text-cf-ink-60" />
          <div className="text-center">
            <p className="text-sm font-medium text-cf-ink">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-cf-ink-60 mt-1">
              PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept={PATIENT_DOCUMENT_ACCEPT}
          />
        </label>
      </Card>

      {formData.attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cf-ink-60">
            Uploaded Files:
          </p>
          {formData.attachments.map((attachment) => (
            <Card key={attachment.id} className="border-cf-border p-3">
              <CardContent className="p-0 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-cf-ink truncate">
                    {attachment.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-cf-ink-60">
                    <DotSeparated parts={getAttachmentMetaParts(attachment)} />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  className="text-cf-ink-40 hover:text-cf-ink transition-colors flex-shrink-0"
                  aria-label={`Remove ${attachment.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}