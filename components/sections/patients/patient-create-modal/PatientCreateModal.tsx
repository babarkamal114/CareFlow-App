'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  ScrollArea
} from "@/components/ui"
import { useCarers } from 'hooks';
import {
  STEP_LABELS,
  TOTAL_STEPS,
  buildNewPatient,
  createEmptyPatientForm,
  getStepKey,
  validatePatientStep,
  type PatientFormData,
} from 'utils';
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

export type { PatientFormData } from 'utils';

interface CreatePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreate?: (patient: any) => void;
}

export function CreatePatientModal({
  open,
  onOpenChange,
  onPatientCreate,
}: CreatePatientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PatientFormData>(createEmptyPatientForm);

  // Only fetch while the modal is open.
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

    onPatientCreate?.(buildNewPatient(formData, carersState.carers));

    setFormData(createEmptyPatientForm());
    setCurrentStep(1);
    setErrors({});
    onOpenChange(false);
  };

  const renderStep = () => {
    switch (stepKey) {
      case 'personal':
        return (
          <PatientInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 'medical-history':
        return <MedicalHistoryStep formData={formData} setFormData={setFormData} />;
      case 'communication':
        return <CommunicationStep formData={formData} setFormData={setFormData} />;
      case 'preferences':
        return <PreferencesStep formData={formData} setFormData={setFormData} />;
      case 'contacts':
        return (
          <KeyContactsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 'life-story':
        return <LifeStoryStep formData={formData} setFormData={setFormData} />;
      case 'medications':
        return <MedicationsStep formData={formData} setFormData={setFormData} />;
      case 'carers':
        return (
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
        );
      case 'documents':
        return <AttachmentsStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

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