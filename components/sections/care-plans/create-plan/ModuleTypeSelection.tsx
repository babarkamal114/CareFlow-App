'use client';

import { Card } from "@/components/ui";
import { 
  User, 
  Pill, 
  Brain, 
  Utensils, 
  Activity, 
  Heart,
  Check
} from 'lucide-react';
import { CarePlanType } from "types";

interface ModuleTypeSelectionProps {
  selectedType?: CarePlanType;
  onSelect: (type: CarePlanType) => void;
}

const moduleTypes = [
  {
    id: 'personal-care' as CarePlanType,
    title: 'Personal Care',
    description: 'Hygiene, continence, skin integrity, and daily living support',
    icon: User,
    color: 'border-[var(--cf-blue-500)] bg-[var(--cf-blue-50)] hover:bg-[var(--cf-blue-50)]',
  },
  {
    id: 'medication' as CarePlanType,
    title: 'Medication',
    description: 'Medication management, adherence, and administration',
    icon: Pill,
    color: 'border-[var(--cf-brand-500)] bg-[var(--cf-brand-50)] hover:bg-[var(--cf-brand-100)]',
  },
  {
    id: 'dementia' as CarePlanType,
    title: 'Dementia',
    description: 'Cognitive support, behavioral strategies, and memory care',
    icon: Brain,
    color: 'border-cf-ink-40 bg-cf-surface-muted hover:bg-cf-ink-20/30',
  },
  {
    id: 'nutrition' as CarePlanType,
    title: 'Nutrition',
    description: 'Dietary needs, swallowing support, and meal planning',
    icon: Utensils,
    color: 'border-[var(--cf-amber-500)] bg-[var(--cf-amber-50)] hover:bg-[var(--cf-amber-50)]',
  },
  {
    id: 'mobility' as CarePlanType,
    title: 'Mobility',
    description: 'Fall prevention, mobility aids, and physical therapy',
    icon: Activity,
    color: 'border-[var(--cf-brand-700)] bg-[var(--cf-brand-100)] hover:bg-[var(--cf-brand-100)]',
  },
  {
    id: 'mental-health' as CarePlanType,
    title: 'Mental Health',
    description: 'Psychological support, coping strategies, and wellbeing',
    icon: Heart,
    color: 'border-[var(--cf-red-500)] bg-[var(--cf-red-50)] hover:bg-[var(--cf-red-50)]',
  },
];

export function ModuleTypeSelection({ selectedType, onSelect }: ModuleTypeSelectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cf-ink">Select Module Type</h3>
      <p className="text-sm text-cf-ink-60">
        Choose the type of care plan module you want to create
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {moduleTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card
              key={type.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md border-l-4 ${
                isSelected
                  ? `${type.color} shadow-md scale-[1.02]`
                  : 'border-l-gray-200 hover:border-l-gray-400'
              }`}
              onClick={() => onSelect(type.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-white/50' : 'bg-gray-50'
                }`}>
                  <Icon className="h-6 w-6 text-cf-ink-60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-cf-ink">{type.title}</h4>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-cf-primary text-white flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-cf-ink-60 mt-0.5">{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}