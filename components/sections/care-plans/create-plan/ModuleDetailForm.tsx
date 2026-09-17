'use client';

import { useState } from 'react';
import { Button } from "@/components/ui";
import { CarePlanType, CarePlanModuleContent } from "types";
import { PersonalCareForm } from './PersonalCareForm';
import { ChevronRight } from 'lucide-react';

interface ModuleDetailsFormProps {
  type: CarePlanType;
  data: CarePlanModuleContent | Record<string, unknown> | undefined;
  onUpdate: (data: CarePlanModuleContent | Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ModuleDetailsForm({
  type,
  data,
  onUpdate,
  onNext,
  onBack,
}: ModuleDetailsFormProps) {
  const [isValid, setIsValid] = useState(false);

  const renderForm = () => {
    switch (type) {
      case 'personal-care':
        return <PersonalCareForm data={data} onUpdate={onUpdate} onValidate={setIsValid} />;
      default:
        return <div>Form not found</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cf-ink">
          Fill Module Details
        </h3>
        <span className="text-sm text-cf-ink-60">
          {type.replace('-', ' ')}
        </span>
      </div>

      <div className="min-h-[400px]">
        {renderForm()}
      </div>

      <div className="flex justify-between pt-4 border-t border-cf-border">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="gap-2"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}