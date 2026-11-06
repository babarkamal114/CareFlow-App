"use client";

import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@/components/ui";
import { validateSignDocument } from "lib";
import { PenLine } from "lucide-react";
import { useState } from "react";
import type { ComplianceFormErrors, SignatureItem, SignDocumentFormData } from "types";
import { ComplianceField } from "./compliance-field";

interface SignDocumentDialogProps {
  item: SignatureItem | null;
  onClose: () => void;
  onSubmit: (data: SignDocumentFormData) => void;
}

export function SignDocumentDialog({ item, onClose, onSubmit }: SignDocumentDialogProps) {
  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        {item && <SignForm item={item} onSubmit={onSubmit} onCancel={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function SignForm({ item, onSubmit, onCancel }: { item: SignatureItem; onSubmit: (d: SignDocumentFormData) => void; onCancel: () => void }) {
  const [form, setForm] = useState<SignDocumentFormData>({ fullName: "", agreed: false });
  const [errors, setErrors] = useState<ComplianceFormErrors>({});

  const handleSubmit = () => {
    const next = validateSignDocument(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Sign document</DialogTitle>
        <DialogDescription>{item.document} · {item.patient}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <ComplianceField label="Full name" required htmlFor="sig-name" error={errors.fullName}
          hint="Your signature is timestamped and linked to your signed-in account.">
          <div className="relative">
            <PenLine className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cf-ink-40" />
            <Input id="sig-name" className="pl-9 font-heading italic" value={form.fullName} placeholder="Type your full name"
              aria-invalid={Boolean(errors.fullName)} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          </div>
        </ComplianceField>

        <ComplianceField label="" error={errors.agreed}>
          <div className="flex items-start gap-3">
            <Checkbox id="sig-agree" className="mt-0.5" checked={form.agreed} onCheckedChange={(c) => setForm((p) => ({ ...p, agreed: c === true }))} />
            <Label htmlFor="sig-agree" className="text-sm font-normal text-cf-ink-80">
              I confirm I have read this document and that typing my name is my legally valid electronic signature.
            </Label>
          </div>
        </ComplianceField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Sign document</Button>
      </DialogFooter>
    </>
  );
}
