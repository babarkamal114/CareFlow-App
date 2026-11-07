"use client";

import {
  StaffDocumentRow,
  StaffFormErrorBanner,
  StaffFormFieldRow,
  StaffFormFileUpload,
  StaffFormSectionLabel,
} from "@/components/ui";
import { STAFF_DOCUMENT_TYPE_LABELS, StaffFormSectionProps } from "types";
import type { StaffFormData } from "types";
import {DOCUMENT_TYPE_GUIDE} from 'utils'

export function DocumentsSection({ data, errors, onChange }: StaffFormSectionProps) {
  const addDocument = (file: File) => {
    onChange({
      ...data,
      documents: [
        ...data.documents,
        {
          type: "other",
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
          fileName: file.name,
        },
      ],
    });
  };

  const updateDocumentAt = (
    index: number,
    document: StaffFormData["documents"][number]
  ) => {
    const documents = [...data.documents];
    documents[index] = document;
    onChange({ ...data, documents });
  };

  const removeDocument = (index: number) => {
    onChange({
      ...data,
      documents: data.documents.filter((_, position) => position !== index),
    });
  };

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Upload Documents</StaffFormSectionLabel>

      <StaffFormFieldRow
        label="Add a document"
        hint="PDF, JPEG or PNG up to 10MB. Each file is uploaded separately."
        error={errors.documents}
      >
        <StaffFormFileUpload
          id="staffDocument"
          label="Choose file"
          accept=".pdf,.jpg,.jpeg,.png"
          onSelect={addDocument}
        />
      </StaffFormFieldRow>

      <StaffFormSectionLabel>What To Upload</StaffFormSectionLabel>

      <ul className="space-y-1.5">
        {DOCUMENT_TYPE_GUIDE.map((entry) => (
          <li
            key={entry.type}
            className="flex gap-2 text-sm text-muted-foreground"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cf-ink-40" />
            <span>
              <span className="font-medium text-cf-ink">
                {STAFF_DOCUMENT_TYPE_LABELS[entry.type]}
              </span>{" "}
              — {entry.hint}
            </span>
          </li>
        ))}
      </ul>

      <StaffFormSectionLabel>Uploaded</StaffFormSectionLabel>

      {data.documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No documents uploaded yet.
        </p>
      )}

      <div className="space-y-3">
        {data.documents.map((document, index) => (
          <StaffDocumentRow
            key={`${document.url}-${index}`}
            document={document}
            onTypeChange={(type) =>
              updateDocumentAt(index, { ...document, type })
            }
            onRemove={() => removeDocument(index)}
          />
        ))}
      </div>
    </div>
  );
}
