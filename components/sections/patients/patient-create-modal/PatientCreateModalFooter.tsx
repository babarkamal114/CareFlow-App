'use client';

import { Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CreatePatientModalFooterProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onCreate: () => void;
}

export function CreatePatientModalFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onCreate,
}: CreatePatientModalFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-cf-border pt-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="border-cf-border gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 === currentStep ? 'bg-cf-primary' : 'bg-cf-border'
            }`}
          />
        ))}
      </div>

      {currentStep === totalSteps ? (
        <Button
          onClick={onCreate}
          
        >
          Create Patient
        </Button>
      ) : (
        <Button
          onClick={onNext}
          
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}