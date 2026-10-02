'use client';

import { Card, CardContent, Badge } from "@/components/ui";

const MEDICATION_TYPE_LABEL: Record<string, string> = {
  regular: 'Regular',
  prn: 'PRN',
  controlled: 'Controlled',
  'short-course': 'Short Course',
  'variable-dose': 'Variable Dose',
};

const medicationTypeBadgeVariant = (value: string) => {
  if (value === 'controlled') return 'pastel-danger';
  if (value === 'prn') return 'pastel-warning';
  if (value === 'variable-dose') return 'pastel-info';
  return 'pastel-success';
};

const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timing: 'Morning',
    route: 'Oral',
    indication: 'Hypertension',
    prescriber: 'Dr. Sarah Ahmed',
    prescribedDate: '2024-01-15',
    medicationType: 'regular',
    instructions: 'Take with water, avoid grapefruit',
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timing: 'With meals',
    route: 'Oral',
    indication: 'Type 2 Diabetes',
    prescriber: 'Dr. Sarah Ahmed',
    prescribedDate: '2023-11-20',
    medicationType: 'regular',
    instructions: '',
  },
  {
    id: '3',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    timing: 'Evening',
    route: 'Oral',
    indication: 'Hypertension',
    prescriber: 'Dr. James Wilson',
    prescribedDate: '2024-02-01',
    medicationType: 'regular',
    instructions: '',
  },
  {
    id: '4',
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Up to 4x daily',
    timing: 'As needed',
    route: 'Oral',
    indication: 'Pain relief',
    prescriber: 'Dr. James Wilson',
    prescribedDate: '2024-01-05',
    medicationType: 'prn',
    instructions: 'Do not exceed 8 tablets in 24 hours',
  },
  {
    id: '5',
    name: 'Morphine Sulfate',
    dosage: '10mg',
    frequency: 'Every 4 hours',
    timing: 'As directed',
    route: 'Oral',
    indication: 'Severe pain management',
    prescriber: 'Dr. Sarah Ahmed',
    prescribedDate: '2024-03-01',
    medicationType: 'controlled',
    instructions: 'Dual-witness administration required. Log stock balance after each dose.',
  },
];

export function PatientMedicationsTab() {
  return (
    <div className="space-y-3">
      {mockMedications.map((med) => (
        <Card key={med.id} className="border-cf-border">
          <CardContent className="pt-4">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-cf-ink">{med.name}</p>
                    <Badge
                      variant={medicationTypeBadgeVariant(med.medicationType)}
                      className="text-[10px]"
                      shape="pill"
                    >
                      {MEDICATION_TYPE_LABEL[med.medicationType] || 'Regular'}
                    </Badge>
                  </div>
                  <p className="text-xs text-cf-ink-60 mt-0.5">{med.indication}</p>
                </div>
                <Badge variant="pastel-info" className="text-xs shrink-0" shape="pill">
                  {med.dosage}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-cf-ink-60 flex-wrap">
                <span>{med.frequency}</span>
                <span>•</span>
                <span>{med.timing}</span>
                <span>•</span>
                <span>{med.route}</span>
              </div>
              {med.instructions && (
                <div className="text-xs text-cf-ink-60 bg-cf-surface-muted rounded p-2">
                  {med.instructions}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-cf-ink-40">
                <span>Prescribed by {med.prescriber}</span>
                <span>•</span>
                <span>Since {new Date(med.prescribedDate).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
