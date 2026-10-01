'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from "@/components/ui";
import { X, Plus } from 'lucide-react';
import {
  PATIENT_HISTORY_SECTIONS,
  addPatientHistoryItem,
  canAddPatientHistoryItem,
  getEmptyPatientHistoryDrafts,
  getPatientHistoryItems,
  removePatientHistoryItem,
  type PatientFormData,
  type PatientHistorySection,
} from 'utils';
import { CompactInputField, CompactSelectField } from 'sections';
import { DotSeparated } from '../DotSeparated';

interface MedicalHistoryStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function MedicalHistoryStep({ formData, setFormData }: MedicalHistoryStepProps) {
  const [drafts, setDrafts] = useState(getEmptyPatientHistoryDrafts);

  const updateDraft = (section: PatientHistorySection, name: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [section.key]: { ...prev[section.key], [name]: value } }));
  };

  const handleAdd = (section: PatientHistorySection) => {
    if (!canAddPatientHistoryItem(section, drafts[section.key])) return;

    setFormData(addPatientHistoryItem(formData, section.key, drafts[section.key]));
    setDrafts((prev) => ({ ...prev, [section.key]: { ...section.emptyDraft } }));
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Medical History</h3>
        <p className="text-sm text-cf-ink-60">Health conditions, allergies, and hospital history</p>
      </div>

      {PATIENT_HISTORY_SECTIONS.map((section) => {
        const draft = drafts[section.key];
        const items = getPatientHistoryItems(formData, section.key);

        return (
          <div key={section.key} className="space-y-3">
            <h4 className="text-sm font-medium text-cf-ink">{section.heading}</h4>
            <Card className="border-cf-border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {section.gridFields.map((field) => (
                  <CompactInputField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    placeholder={field.placeholder}
                    type={field.type}
                    value={draft[field.name] ?? ''}
                    onChange={(val) => updateDraft(section, field.name, val)}
                  />
                ))}
              </div>
              {section.selectField && (
                <CompactSelectField
                  id={section.selectField.id}
                  label={section.selectField.label}
                  options={section.selectField.options}
                  value={draft[section.selectField.name] ?? ''}
                  onChange={(val) => updateDraft(section, section.selectField!.name, val)}
                />
              )}
              {section.extraFields.map((field) => (
                <CompactInputField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={draft[field.name] ?? ''}
                  onChange={(val) => updateDraft(section, field.name, val)}
                />
              ))}
              <Button
                onClick={() => handleAdd(section)}
                variant="outline"
                size="sm"
                className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                {section.addLabel}
              </Button>
            </Card>

            {items.length > 0 && (
              <div className="space-y-2">
                {items.map((item) => (
                  <Card key={item.id} className={section.listCardClass}>
                    <CardContent className="p-0 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-cf-ink">{item.title}</p>
                        <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1">
                          <DotSeparated parts={item.metaParts} />
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData(removePatientHistoryItem(formData, section.key, item.id))}
                        className="text-cf-ink-40 hover:text-cf-error transition-colors"
                        aria-label={`Remove ${item.title}`}
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
      })}
    </div>
  );
}