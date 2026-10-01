'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui"
import { Loader2 } from 'lucide-react';
import {
  EDIT_PATIENT_SECTIONS,
  buildEditPatientForm,
  validateEditPatientForm,
  type PatientEditData,
} from 'utils';
import { PatientFormSections } from '../PatientFormField';

interface EditPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientEditData | null;
  onSave: (data: Partial<PatientEditData>) => Promise<void>;
}

export function EditPatientModal({
  open,
  onOpenChange,
  patient,
  onSave,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState<Partial<PatientEditData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patient && open) {
      setFormData(buildEditPatientForm(patient));
    }
  }, [patient, open]);

  const clearError = (name: string) => {
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const validate = () => {
    const newErrors = validateEditPatientForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update patient information for {patient.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <PatientFormSections
            sections={EDIT_PATIENT_SECTIONS}
            values={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
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
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}