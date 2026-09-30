'use client';

import { useState, useEffect } from 'react';
import {
  Label,
  Input,
  Button,
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
} from "@/components/ui"
import { Loader2 } from 'lucide-react';
import {
  EDIT_PATIENT_SECTIONS,
  buildEditPatientForm,
  validateEditPatientForm,
  type EditPatientFieldDef,
  type PatientEditData,
} from 'utils';

interface EditPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientEditData | null;
  onSave: (data: Partial<PatientEditData>) => Promise<void>;
}

interface EditPatientFieldProps {
  field: EditPatientFieldDef;
  value: string;
  error: string | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

function EditPatientField({ field, value, error, onInputChange, onSelectChange }: EditPatientFieldProps) {
  if (field.kind === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
        </Label>
        <Select value={value} onValueChange={(val) => onSelectChange(field.name, val!)}>
          <SelectTrigger className="border-cf-border">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={onInputChange}
        className={`border-cf-border ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const renderField = (field: EditPatientFieldDef) => (
    <EditPatientField
      key={field.name}
      field={field}
      value={formData[field.name] || ''}
      error={errors[field.name]}
      onInputChange={handleInputChange}
      onSelectChange={handleSelectChange}
    />
  );

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
          {EDIT_PATIENT_SECTIONS.map((section) =>
            section.gridClass ? (
              <div key={section.id} className={section.gridClass}>
                {section.fields.map(renderField)}
              </div>
            ) : (
              section.fields.map(renderField)
            )
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
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}