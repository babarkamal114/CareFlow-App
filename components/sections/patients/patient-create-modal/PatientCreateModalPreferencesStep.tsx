'use client';

import { CREATE_PATIENT_PREFERENCES_SECTIONS, type PatientFormData } from 'utils';
import { PatientFormSections } from '../PatientFormField';

interface PreferencesStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function PreferencesStep({ formData, setFormData }: PreferencesStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Preferences & Wishes</h3>
        <p className="text-sm text-cf-ink-60">Daily routine, likes, dislikes, and what matters to the patient</p>
      </div>

      <PatientFormSections
        sections={CREATE_PATIENT_PREFERENCES_SECTIONS}
        values={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}