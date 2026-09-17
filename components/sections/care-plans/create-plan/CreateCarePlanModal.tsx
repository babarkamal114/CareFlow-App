'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { Progress } from "@/components/ui";
import { Check } from 'lucide-react';
import { CreationStep, ModuleCreationData } from "types";
import { ModuleTypeSelection } from './ModuleTypeSelection';
import { ModuleDetailsForm } from './ModuleDetailForm';
import { ModuleReviewSubmit } from './ModuleReviewSubmit';

interface CarePlanCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId?: string;
  onComplete?: (data: ModuleCreationData) => void;
}

const steps: { id: CreationStep; title: string; description: string }[] = [
  { id: 'select-type', title: 'Select Module Type', description: 'Choose the type of care plan module' },
  { id: 'fill-details', title: 'Fill Details', description: 'Provide the module-specific information' },
  { id: 'review-submit', title: 'Review & Submit', description: 'Review all information before creating' },
];

export function CarePlanCreationModal({
  open,
  onOpenChange,
  patientId,
  onComplete,
}: CarePlanCreationModalProps) {
  const [currentStep, setCurrentStep] = useState<CreationStep>('select-type');
  const [creationData, setCreationData] = useState<Partial<ModuleCreationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (creationData.type && creationData.content) {
        const finalData: ModuleCreationData = {
          patientId: creationData.patientId || patientId || '',
          type: creationData.type,
          name: creationData.name || `${creationData.type} Plan`,
          content: creationData.content,
          status: creationData.status || 'draft',
          reviewStatus: 'current',
          createdBy: 'Current User', 
          version: 'v1.0',
        };
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onComplete?.(finalData);
        handleClose();
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('select-type');
    setCreationData({});
    onOpenChange(false);
  };

  const updateCreationData = (data: Partial<ModuleCreationData>) => {
    setCreationData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'select-type':
        return (
          <ModuleTypeSelection
            selectedType={creationData.type}
            onSelect={(type) => {
              updateCreationData({ 
                type, 
                name: `${type.replace('-', ' ')} Plan`
              });
              handleNext();
            }}
          />
        );
      case 'fill-details':
        return (
          <ModuleDetailsForm
            type={creationData.type!}
            data={creationData.content}
            onUpdate={(content) => updateCreationData({ content })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'review-submit':
        return (
          <ModuleReviewSubmit
            data={creationData}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b border-cf-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Create New Care Plan Module
              </DialogTitle>
              <DialogDescription className="text-cf-ink-60">
                {steps[currentStepIndex].description}
              </DialogDescription>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-cf-ink-60 mb-1">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  index <= currentStepIndex
                    ? 'bg-cf-primary text-white'
                    : 'bg-cf-surface-muted text-cf-ink-40'
                }`}>
                  {index < currentStepIndex ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs ${
                  index === currentStepIndex
                    ? 'text-cf-ink font-medium'
                    : 'text-cf-ink-40'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}