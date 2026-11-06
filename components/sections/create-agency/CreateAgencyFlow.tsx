"use client";

import { useState } from "react";
import { WelcomeStep } from "./WelcomeStep";
import { AgencyDetailsStep } from "./AgencyDetailStep";
import { SuccessStep } from "./SuccessStep";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useCreateAgency } from "hooks";

const STEPS = [
  { id: 1, label: "Welcome" },
  { id: 2, label: "Agency Details" },
  { id: 3, label: "Success" },
];

export function CreateAgencyFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = STEPS.length;

  const { formData, updateField, handleSubmit, isLoading, error } =
    useCreateAgency();

  const handleCreateAgency = () => {
    handleSubmit(() => {
      router.push("/");
    });
  };

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
        return (
          <AgencyDetailsStep
            error={error as string | null}
            formData={formData}
            updateField={updateField}
            isLoading={isLoading}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <SuccessStep
            agencyName={formData.name}
            error={error as string | null}
            isCreating={isLoading}
            onCreateAgency={handleCreateAgency}
          />
        );
      default:
        return null;
    }
  };

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-primary/20 via-slate-100 to-slate-100 flex items-center justify-center p-4">
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <div className="sticky top-8 ring-4 ring-primary/10 bg-cf-surface rounded-lg border-2 border-primary/20 p-6 ">
            <div className="space-y-4">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex gap-3 items-start">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-600 transition-all ${
                      index < currentStep
                        ? "bg-primary/70 text-white"
                        : index === currentStep
                        ? "bg-primary text-white ring-4 ring-primary/10"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {index < currentStep ? (
                      <span>✓</span>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-500 transition-colors ${
                        index <= currentStep
                          ? "text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {index === currentStep && (
                      <p className="text-xs text-cf-ink-60 mt-1">Current</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

           
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-500 text-slate-600">
                  Progress
                </span>
                <span className="text-xs font-600 text-slate-900">
                  {currentStep }/{totalSteps}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2 w-full ">
          <div className="bg-cf-surface rounded-xl border-2 border-primary/20 p-8  ring-4 ring-primary/10 ">
            {renderStep()}

          </div>
        </div>
      </div>
    </div>
  );
}