'use client';

import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { CarePlanViewerModal } from './view-plan/CarePlanViewerModal';
import { CarePlan } from "types";

interface CarePlanBlocksSectionProps {
  carePlans?: CarePlan[];
  filterTab?: string;
  searchQuery?: string;
}

const statusColorMap: Record<string, string> = {
  'draft': 'bg-yellow-100 text-yellow-700',
  'in-review': 'bg-blue-100 text-blue-700',
  'approved': 'bg-green-100 text-green-700',
};

function getDaysUntil(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  }
  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Tomorrow';
  }
  return `${diffDays} days`;
}

export function CarePlanBlocksSection({ carePlans = [] }: CarePlanBlocksSectionProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlanId(null);
  };

  const selectedCarePlan = selectedPlanId ? carePlans.find(p => p.id === selectedPlanId) || null : null;

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {carePlans.map((plan) => {
          const daysUntil = getDaysUntil(plan.nextReviewDate);
          const isOverdue = daysUntil.includes('overdue');
          
          return (
            <Card
              key={plan.id}
              className="border-l-4 hover:shadow-md transition-shadow cursor-pointer border-l-cf-primary bg-cf-primary/5"
              onClick={() => handlePlanClick(plan.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h1 className='text-xl font-semibold text-cf-ink-60'>{plan.patientName}'s Care Plan Vault</h1>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusColorMap[plan.overallStatus] || statusColorMap['draft']}`}>
                      {plan.overallStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cf-ink-80">Patient ID: {plan.patientId}</h3>
                  <span className="text-xs text-cf-ink-40">{plan.modules.length} Modules</span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs text-cf-ink-60">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Key Worker: {plan.keyWorker}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Last Reviewed: {plan.lastReviewDate}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-cf-border-light">
                  <div className="flex items-center gap-1.5">
                    <Clock className={`h-3.5 w-3.5 ${isOverdue ? 'text-cf-red-500' : 'text-cf-ink-40'}`} />
                    <span className={`text-xs ${isOverdue ? 'text-cf-red-500 font-medium' : 'text-cf-ink-60'}`}>
                      {isOverdue ? `⚠️ ${daysUntil}` : `Next review: ${daysUntil}`}
                    </span>
                  </div>

                  <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs text-cf-brand-500 px-2">
                    Open Vault
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CarePlanViewerModal
        carePlan={selectedCarePlan}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onEdit={() => {}}
      />
    </>
  );
}