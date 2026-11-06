'use client';

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  ScrollArea
} from "@/components/ui"
import { useCarers } from 'hooks';
import { STEP_LABELS, TOTAL_STEPS, buildNewPatient, createEmptyPatientForm, getStepKey } from 'utils';
import { validatePatientStep } from 'lib';
import type { Patient, PatientFormData, PatientFormErrors, PatientMedication, PatientStepKey } from 'types';
import { CreatePatientModalProgress } from './PatientCreateModalProgress';
import { CreatePatientModalFooter } from './PatientCreateModalFooter';
import { AttachmentsStep } from './PatientCreateModalDocStep';
import { AssignCarersStep } from './PatientCreateModalAssignCarerStep';
import { MedicationsStep } from './PatientCreateModalMedStep';
import { LifeStoryStep } from './PatientCreateModalLifeStoryStep';
import { KeyContactsStep } from './PatientCreateModalKeyContactsStep';
import { PreferencesStep } from './PatientCreateModalPreferencesStep';
import { CommunicationStep } from './PatientCreateModalCommunicationStep';
import { MedicalHistoryStep } from './PatientCreateModalMedHistoryStep';
import { PatientInfoStep } from './PatientCreateModalInfoStep';

interface CreatePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreate?: (patient: Patient, medications: PatientMedication[]) => void;
}

interface StepContext {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: PatientFormErrors;
  setErrors: (errors: PatientFormErrors) => void;
  carersState: ReturnType<typeof useCarers>;
}

const STEP_RENDERERS: Record<PatientStepKey, (ctx: StepContext) => ReactNode> = {
  personal: ({ formData, setFormData, errors, setErrors }) => (
    <PatientInfoStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
  ),
  'medical-history': ({ formData, setFormData }) => (
    <MedicalHistoryStep formData={formData} setFormData={setFormData} />
  ),
  communication: ({ formData, setFormData }) => (
    <CommunicationStep formData={formData} setFormData={setFormData} />
  ),
  preferences: ({ formData, setFormData }) => (
    <PreferencesStep formData={formData} setFormData={setFormData} />
  ),
  contacts: ({ formData, setFormData, errors, setErrors }) => (
    <KeyContactsStep formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
  ),
  'life-story': ({ formData, setFormData }) => (
    <LifeStoryStep formData={formData} setFormData={setFormData} />
  ),
  medications: ({ formData, setFormData }) => (
    <MedicationsStep formData={formData} setFormData={setFormData} />
  ),
  carers: ({ formData, setFormData, errors, setErrors, carersState }) => (
    <AssignCarersStep
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      carers={carersState.carers}
      isLoading={carersState.isLoading}
      error={carersState.error}
      onRetry={carersState.refetch}
    />
  ),
  documents: ({ formData, setFormData }) => (
    <AttachmentsStep formData={formData} setFormData={setFormData} />
  ),
};

export function CreatePatientModal({
  open,
  onOpenChange,
  onPatientCreate,
}: CreatePatientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [formData, setFormData] = useState<PatientFormData>(createEmptyPatientForm);
  const carersState = useCarers(open);

  const stepKey = getStepKey(currentStep);

  const validateStep = (): boolean => {
    const newErrors = validatePatientStep(stepKey, formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep()) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreatePatient = () => {
    if (!validateStep()) return;

    onPatientCreate?.(buildNewPatient(formData, carersState.carers), formData.medications);

    setFormData(createEmptyPatientForm());
    setCurrentStep(1);
    setErrors({});
    onOpenChange(false);
  };

  const renderStep = () =>
    stepKey ? STEP_RENDERERS[stepKey]({ formData, setFormData, errors, setErrors, carersState }) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Patient
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {TOTAL_STEPS}
          </DialogDescription>
        </DialogHeader>

        <CreatePatientModalProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        <ScrollArea className="min-h-96 pr-4">{renderStep()}</ScrollArea>

        <CreatePatientModalFooter
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
          onCreate={handleCreatePatient}
        />
      </DialogContent>
    </Dialog>
  );
}