'use client';

import { CREATE_PATIENT_LIFE_STORY_SECTIONS, type PatientFormData } from 'utils';
import { PatientFormSections } from '../PatientFormField';

interface LifeStoryStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function LifeStoryStep({ formData, setFormData }: LifeStoryStepProps) {
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
        <h3 className="text-lg font-semibold text-cf-ink">Life Story</h3>
        <p className="text-sm text-cf-ink-60">Who the patient is as a person</p>
      </div>

      <PatientFormSections
        sections={CREATE_PATIENT_LIFE_STORY_SECTIONS}
        values={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
}