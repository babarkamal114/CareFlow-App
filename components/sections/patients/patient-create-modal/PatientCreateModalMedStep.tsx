// components/sections/patients/CreatePatientModal/steps/MedicationsStep.tsx
'use client';

import { useState } from 'react';
import {
  Input,
  Label,
  Button,
  Card, 
  CardContent,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { X } from 'lucide-react';
import { PatientFormData } from './PatientCreateModal';

const MEDICATION_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'prn', label: 'PRN (As Needed)' },
  { value: 'controlled', label: 'Controlled Drug' },
  { value: 'short-course', label: 'Short Course' },
  { value: 'variable-dose', label: 'Variable Dose' },
] as const;

const ROUTES = ['Oral', 'Topical', 'Inhaled', 'Subcutaneous', 'Intramuscular', 'Patch', 'PEG'];

const medicationTypeLabel = (value: string) =>
  MEDICATION_TYPES.find((t) => t.value === value)?.label || 'Regular';

const medicationTypeBadgeVariant = (value: string) => {
  if (value === 'controlled') return 'pastel-danger';
  if (value === 'prn') return 'pastel-warning';
  if (value === 'variable-dose') return 'pastel-info';
  return 'pastel-success';
};

interface MedicationsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function MedicationsStep({
  formData,
  setFormData,
}: MedicationsStepProps) {
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    timing: '',
    indication: '',
    route: 'Oral',
    prescriber: '',
    startDate: '',
    medicationType: 'regular' as const,
    instructions: '',
  });

  const handleAddMedication = () => {
    if (
      newMedication.name &&
      newMedication.dosage &&
      newMedication.frequency &&
      newMedication.timing
    ) {
      setFormData({
        ...formData,
        medications: [
          ...formData.medications,
          {
            id: Date.now().toString(),
            ...newMedication,
          },
        ],
      });
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        timing: '',
        indication: '',
        route: 'Oral',
        prescriber: '',
        startDate: '',
        medicationType: 'regular',
        instructions: '',
      });
    }
  };

  const handleRemoveMedication = (id: string) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((med: any) => med.id !== id),
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">Medications</h3>
      <p className="text-sm text-cf-ink-60">
        Add medications for this patient (optional)
      </p>

      <Card className="border-cf-border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="med-name" className="text-xs font-medium">
              Medication Name
            </Label>
            <Input
              id="med-name"
              placeholder="Lisinopril"
              value={newMedication.name}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-dosage" className="text-xs font-medium">
              Dosage
            </Label>
            <Input
              id="med-dosage"
              placeholder="10mg"
              value={newMedication.dosage}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  dosage: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-frequency" className="text-xs font-medium">
              Frequency
            </Label>
            <Input
              id="med-frequency"
              placeholder="Once daily"
              value={newMedication.frequency}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-timing" className="text-xs font-medium">
              Timing
            </Label>
            <Input
              id="med-timing"
              placeholder="Morning"
              value={newMedication.timing}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  timing: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-route" className="text-xs font-medium">
              Route
            </Label>
            <Select
              value={newMedication.route}
              onValueChange={(val) => setNewMedication((prev) => ({ ...prev, route: val! }))}
            >
              <SelectTrigger id="med-route" className="border-cf-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROUTES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-type" className="text-xs font-medium">
              Medication Type
            </Label>
            <Select
              value={newMedication.medicationType}
              onValueChange={(val) =>
                setNewMedication((prev) => ({ ...prev, medicationType: val as any }))
              }
            >
              <SelectTrigger id="med-type" className="border-cf-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDICATION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-prescriber" className="text-xs font-medium">
              Prescriber
            </Label>
            <Input
              id="med-prescriber"
              placeholder="Dr. Sarah Ahmed"
              value={newMedication.prescriber}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  prescriber: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="med-start-date" className="text-xs font-medium">
              Start Date
            </Label>
            <Input
              id="med-start-date"
              type="date"
              value={newMedication.startDate}
              onChange={(e) =>
                setNewMedication((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="border-cf-border h-8 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="med-indication" className="text-xs font-medium">
            Indication (optional)
          </Label>
          <Input
            id="med-indication"
            placeholder="Hypertension"
            value={newMedication.indication}
            onChange={(e) =>
              setNewMedication((prev) => ({
                ...prev,
                indication: e.target.value,
              }))
            }
            className="border-cf-border h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="med-instructions" className="text-xs font-medium">
            Special Instructions (optional)
          </Label>
          <Input
            id="med-instructions"
            placeholder="Take with food, avoid grapefruit..."
            value={newMedication.instructions}
            onChange={(e) =>
              setNewMedication((prev) => ({
                ...prev,
                instructions: e.target.value,
              }))
            }
            className="border-cf-border h-8 text-sm"
          />
        </div>

        <Button
          onClick={handleAddMedication}
          variant="outline"
          size="sm"
          className="w-full border-cf-border hover:bg-cf-surface-muted text-xs"
        >
          Add Medication
        </Button>
      </Card>

      {formData.medications.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cf-ink-60">
            Added Medications:
          </p>
          {formData.medications.map((med: any) => (
            <Card key={med.id} className="border-cf-border p-3">
              <CardContent className="p-0 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-cf-ink">
                      {med.name}
                    </p>
                    {med.medicationType && (
                      <Badge
                        variant={medicationTypeBadgeVariant(med.medicationType)}
                        className="text-[10px]"
                        shape="pill"
                      >
                        {medicationTypeLabel(med.medicationType)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1 flex-wrap">
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span>{med.frequency}</span>
                    <span>•</span>
                    <span>{med.timing}</span>
                    {med.route && (
                      <>
                        <span>•</span>
                        <span>{med.route}</span>
                      </>
                    )}
                  </div>
                  {(med.prescriber || med.startDate) && (
                    <div className="flex items-center gap-2 text-[10px] text-cf-ink-40 mt-1">
                      {med.prescriber && <span>Prescribed by {med.prescriber}</span>}
                      {med.startDate && (
                        <>
                          {med.prescriber && <span>•</span>}
                          <span>Since {new Date(med.startDate).toLocaleDateString('en-GB')}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveMedication(med.id)}
                  className="text-cf-ink-40 hover:text-cf-ink transition-colors flex-shrink-0"
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
