'use client';

import { CREATE_PATIENT_INFO_SECTIONS, type PatientFormData } from 'utils';
import { PatientFormSections } from '../PatientFormField';

interface PatientInfoStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function PatientInfoStep({
  formData,
  setFormData,
  errors,
  setErrors,
}: PatientInfoStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">
        Personal Details
      </h3>
      <p className="text-sm text-cf-ink-60">
        Basic information about the patient
      </p>

      <PatientFormSections
        sections={CREATE_PATIENT_INFO_SECTIONS}
        values={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
    </div>
  );
}