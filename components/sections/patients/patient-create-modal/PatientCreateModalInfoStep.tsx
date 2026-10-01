'use client';

import { CREATE_PATIENT_INFO_SECTIONS, type PatientFieldDef, type CreatePatientInfoKey, type PatientFormData } from 'utils';
import { PatientFormField } from '../PatientFormField';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const renderField = (field: PatientFieldDef<CreatePatientInfoKey>) => (
    <PatientFormField
      key={field.name}
      field={field}
      value={formData[field.name] || ''}
      error={errors[field.name]}
      onInputChange={handleInputChange}
      onSelectChange={handleSelectChange}
    />
  );

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">
        Personal Details
      </h3>
      <p className="text-sm text-cf-ink-60">
        Basic information about the patient
      </p>

      {CREATE_PATIENT_INFO_SECTIONS.map((section) =>
        section.gridClass ? (
          <div key={section.id} className={section.gridClass}>
            {section.fields.map(renderField)}
          </div>
        ) : (
          section.fields.map(renderField)
        )
      )}
    </div>
  );
}