'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
   Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { X, Plus, Loader2 } from 'lucide-react';

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

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  indication: string;
  route?: string;
  prescriber?: string;
  startDate?: string;
  medicationType?: 'regular' | 'prn' | 'controlled' | 'short-course' | 'variable-dose';
  instructions?: string;
}

interface EditMedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medications: Medication[];
  onSave: (medications: Medication[]) => Promise<void>;
  patientName?: string;
}

const emptyMedication = {
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
};

export function EditMedicationModal({
  open,
  onOpenChange,
  medications,
  onSave,
  patientName,
}: EditMedicationModalProps) {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState(emptyMedication);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && medications) {
      setMeds(medications);
    }
  }, [open, medications]);

  const handleAddMedication = () => {
    if (
      newMedication.name &&
      newMedication.dosage &&
      newMedication.frequency &&
      newMedication.timing
    ) {
      setMeds([
        ...meds,
        {
          id: Date.now().toString(),
          ...newMedication,
        },
      ]);
      setNewMedication(emptyMedication);
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMeds(meds.filter((med) => med.id !== id));
  };

  const handleUpdateMedication = (id: string, field: keyof Medication, value: string) => {
    setMeds(meds.map((med) =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave(meds);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Medications</DialogTitle>
          <DialogDescription>
            {patientName ? `Update medications for ${patientName}` : 'Add or remove medications'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
              className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Medication
            </Button>
          </Card>

          {meds.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-cf-ink-60">
                Current Medications ({meds.length})
              </p>
              {meds.map((med) => (
                <Card key={med.id} className="border-cf-border p-3">
                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Input
                            value={med.name}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'name', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                          />
                          <Input
                            value={med.dosage}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'dosage', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm w-20"
                            placeholder="Dosage"
                          />
                          {med.medicationType && (
                            <Badge
                              variant={medicationTypeBadgeVariant(med.medicationType)}
                              className="text-[10px] shrink-0"
                              shape="pill"
                            >
                              {medicationTypeLabel(med.medicationType)}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={med.frequency}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'frequency', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                            placeholder="Frequency"
                          />
                          <Input
                            value={med.timing}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'timing', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                            placeholder="Timing"
                          />
                          <Input
                            value={med.route || ''}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'route', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                            placeholder="Route"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={med.prescriber || ''}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'prescriber', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                            placeholder="Prescriber"
                          />
                          <Input
                            type="date"
                            value={med.startDate || ''}
                            onChange={(e) =>
                              handleUpdateMedication(med.id, 'startDate', e.target.value)
                            }
                            className="border-cf-border h-7 text-sm flex-1"
                          />
                        </div>
                        <Input
                          value={med.indication || ''}
                          onChange={(e) =>
                            handleUpdateMedication(med.id, 'indication', e.target.value)
                          }
                          className="border-cf-border h-7 text-sm"
                          placeholder="Indication (optional)"
                        />
                        <Input
                          value={med.instructions || ''}
                          onChange={(e) =>
                            handleUpdateMedication(med.id, 'instructions', e.target.value)
                          }
                          className="border-cf-border h-7 text-sm"
                          placeholder="Special instructions (optional)"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        className="text-cf-ink-40 hover:text-cf-error transition-colors flex-shrink-0 mt-1"
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

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-cf-border hover:bg-cf-surface-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-cf-primary hover:bg-cf-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Medications'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
