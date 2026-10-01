'use client';

import { useState } from 'react';
import { Label, Button, Card, CardContent, Checkbox } from "@/components/ui";
import { X, Plus, User, Phone, Mail, AlertCircle } from 'lucide-react';
import {
  CONTACT_DRAFT_FIELDS,
  CONTACT_FLAGS,
  CONTACT_TYPE_LABELS,
  CONTACT_TYPE_OPTIONS,
  EMPTY_CONTACT_DRAFT,
  addPatientContact,
  canAddPatientContact,
  removePatientContact,
  type ContactDraft,
  type PatientContact,
  type PatientFormData,
} from 'utils';
import { CompactInputField, CompactSelectField } from 'sections';

interface KeyContactsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function KeyContactsStep({ formData, setFormData, errors, setErrors }: KeyContactsStepProps) {
  const [newContact, setNewContact] = useState<ContactDraft>({ ...EMPTY_CONTACT_DRAFT });

  const contacts = formData.contacts || [];

  const handleAddContact = () => {
    if (!canAddPatientContact(newContact)) return;

    setFormData(addPatientContact(formData, newContact));
    setNewContact({ ...EMPTY_CONTACT_DRAFT });
    if (errors.contacts) {
      setErrors({ ...errors, contacts: '' });
    }
  };

  const handleRemoveContact = (id: string) => {
    setFormData(removePatientContact(formData, id));
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Key Contacts</h3>
        <p className="text-sm text-cf-ink-60">Everyone involved in the patient's care</p>
      </div>

      {errors.contacts && (
        <div className="flex items-center gap-2 p-3 bg-[var(--cf-error-muted)] border border-[var(--cf-error)]/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-[var(--cf-error)] flex-shrink-0" />
          <p className="text-xs text-[var(--cf-error)]">{errors.contacts}</p>
        </div>
      )}

      <Card className="border-cf-border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <CompactSelectField
            id="contact-type"
            label="Contact Type"
            value={newContact.type}
            options={CONTACT_TYPE_OPTIONS}
            onChange={(val) => setNewContact({ ...newContact, type: val as PatientContact['type'] })}
          />

          {CONTACT_DRAFT_FIELDS.map((field) => (
            <CompactInputField
              key={field.id}
              id={field.id}
              label={field.label}
              placeholder={field.placeholder}
              value={newContact[field.name] || ''}
              onChange={(val) => setNewContact({ ...newContact, [field.name]: val })}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {CONTACT_FLAGS.map((flag) => (
            <div key={flag.name} className="flex items-center gap-2">
              <Checkbox
                id={flag.id}
                checked={newContact[flag.name]}
                onCheckedChange={(checked) => setNewContact({ ...newContact, [flag.name]: checked as boolean })}
              />
              <Label htmlFor={flag.id} className="text-xs font-normal cursor-pointer">
                {flag.label}
              </Label>
            </div>
          ))}
        </div>

        <Button
          onClick={handleAddContact}
          variant="outline"
          size="sm"
          className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Contact
        </Button>
      </Card>

      {contacts.length > 0 && (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <Card key={contact.id} className="border-cf-border p-3">
              <CardContent className="p-0 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <p className="text-sm font-medium text-cf-ink">{contact.name}</p>
                    <span className="text-xs text-cf-ink-40">({CONTACT_TYPE_LABELS[contact.type]})</span>
                    {CONTACT_FLAGS.filter((flag) => contact[flag.name]).map((flag) => (
                      <span key={flag.name} className={flag.badgeClass}>{flag.badgeLabel}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-cf-ink-60 mt-1">
                    {contact.role && <span>{contact.role}</span>}
                    {contact.relationship && <span>• {contact.relationship}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-cf-ink-60 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    {contact.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-cf-ink-40 hover:text-cf-error transition-colors"
                  aria-label={`Remove ${contact.name}`}
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