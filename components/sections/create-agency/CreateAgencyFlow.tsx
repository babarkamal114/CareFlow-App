// src/app/create-agency/components/CreateAgencyFlow.tsx

"use client";

import { useState } from "react";
import { WelcomeStep } from "./WelcomeStep";
import { AgencyDetailsStep } from "./AgencyDetailStep";
import { InviteTeamStep } from "./InviteTeamStep";
import { SuccessStep } from "./SuccessStep";
import { useRouter } from "next/navigation";
import { StepIndicator, ProgressBar } from "@/components/ui";
import { useCreateAgency } from "hooks";

const STEPS = [
  { id: 1, label: "Welcome" },
  { id: 2, label: "Agency Details" },
  { id: 3, label: "Invite Team" },
  { id: 4, label: "Success" },
];

export function CreateAgencyFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = STEPS.length;

    const { formData, updateField, handleSubmit, isLoading, error } =
    useCreateAgency();

  const handleCreateAgency = () => {
    handleSubmit(() => {
      router.push('/')
    })
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <AgencyDetailsStep
        error={error as string | null}
        formData={formData}
        updateField={updateField}
        isLoading={isLoading}
        onNext={handleNext} 
        onBack={handleBack} 
         />;
      case 2:
        return (
          <InviteTeamStep
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleNext}
          />
        );
      case 3:
        return <SuccessStep 
        agencyName={formData.name}
        error={error as string | null}
        isCreating={isLoading}
        onCreateAgency={handleCreateAgency}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#4ab98b]">
      {/* Header Section */}
      <div className="border-b border-green-600/50 px-5 py-8 md:px-12 md:py-10 lg:px-20">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
            Welcome to CareFlow
          </h1>
          <p className="text-sm text-white/70 md:text-base">
            Follow these simple steps to set up your agency
          </p>
        </div>
      </div>

     
      <div className="flex flex-1 overflow-hidden">
    
        <div className="hidden w-64 border-r border-green-600/50  p-8 lg:block">
          <div className="space-y-6">

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                Steps
              </p>
              {STEPS.map((step, index) => (
                <StepIndicator
                  key={step.id}
                  stepNumber={step.id}
                  label={step.label}
                  isActive={index === currentStep}
                  isCompleted={index < currentStep}
                  isCurrent={index === currentStep}
                />
              ))}
            </div>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto">
   
          <div className="border-b border-green-600/50  p-4 lg:hidden">
            <div className="mx-auto w-full max-w-2xl">
              <div className="mt-4 flex items-center justify-center gap-2">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2"
                  >
                    <StepIndicator
                      stepNumber={step.id}
                      label={step.label}
                      isActive={index === currentStep}
                      isCompleted={index < currentStep}
                      isCurrent={index === currentStep}
                      compact
                    />
                    {index < STEPS.length - 1 && (
                      <div className="h-0.5 w-8 bg-cf-border-light" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

       
          <div className="min-h-full p-4 md:p-8 lg:p-12">
            <div className="mx-auto w-full max-w-2xl">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}