'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { Download, Edit2, Calendar, AlertCircle, Maximize2, Minimize2, X } from 'lucide-react';
import { CarePlan, CarePlanModule } from "types";
import { cn } from "lib";
import { PersonalCareModuleView } from './PersonalCareModuleView';
import { MedicationModuleView } from './MedicationModuleView';
import { DementiaModuleView } from './DementiaModuleView';
import { MentalHealthModuleView } from './MentalHealthModalView';
import { MobilityModuleView } from './MobilityModalView';
import { NutritionModuleView } from './NutritionModalView';

interface CarePlanViewerModalProps {
  carePlan: CarePlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
}

const statusColors: Record<string, 'pastel-success' | 'pastel-danger' | 'pastel-info' | 'pastel-warning'> = {
  current: 'pastel-success',
  overdue: 'pastel-danger',
  reviewed: 'pastel-info',
  'needs-change': 'pastel-warning',
};

const statusLabels: Record<string, string> = {
  current: 'Current',
  overdue: 'Overdue',
  reviewed: 'Reviewed',
  'needs-change': 'Needs Change',
};

export function CarePlanViewerModal({
  carePlan,
  open,
  onOpenChange,
  onEdit,
}: CarePlanViewerModalProps) {
  const [selectedModule, setSelectedModule] = useState<CarePlanModule | null>(
    carePlan?.modules[0] || null
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (carePlan?.modules?.length) {
      setSelectedModule(carePlan.modules[0]);
    }
  }, [carePlan]);

  if (!carePlan) return null;

  const renderModuleView = (module: CarePlanModule) => {
    switch (module.type) {
      case 'personal-care':
        return <PersonalCareModuleView module={module} />;
      case 'medication':
        return <MedicationModuleView module={module} />;
      case 'dementia':
        return <DementiaModuleView module={module} />;
      case 'mental-health':
        return <MentalHealthModuleView module={module} />;
      case 'mobility':
        return <MobilityModuleView module={module} />;
      case 'nutrition':
        return <NutritionModuleView module={module} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'p-0 flex flex-col overflow-hidden bg-white duration-200',
          isFullScreen
            ? 'w-screen h-screen max-w-none max-h-none rounded-none'
            : 'max-w-7xl h-[90vh] max-h-[90vh] rounded-xl'
        )}
      >
        <DialogHeader className="border-b border-cf-border pb-4 pt-6 px-6 bg-white shrink-0">
          <div className="space-y-4 w-full">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Care Plan: {carePlan.patientName}
                </DialogTitle>
                <p className="text-sm text-cf-ink-60 mt-1">
                  NHS: {carePlan.nhs_number || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.()}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="h-8 w-8 text-cf-ink-60 hover:text-cf-ink"
                  title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  {isFullScreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 text-cf-ink-60 hover:text-cf-ink"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-sm">
                <p className="text-cf-ink-60 font-medium">Date of Birth</p>
                <p className="text-cf-ink">{carePlan.patientDOB}</p>
              </div>
              <div className="text-sm">
                <p className="text-cf-ink-60 font-medium">Key Worker</p>
                <p className="text-cf-ink">{carePlan.keyWorker}</p>
              </div>
              <div className="text-sm">
                <p className="text-cf-ink-60 font-medium">Address</p>
                <p className="text-cf-ink text-xs">{carePlan.patientAddress}</p>
              </div>
            </div>

            {carePlan.nextReviewDate && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="text-blue-700 font-medium">
                    Next review: {carePlan.nextReviewDate}
                  </p>
                  <p className="text-blue-600 text-xs">
                    Last reviewed: {carePlan.lastReviewDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 grid grid-cols-3 gap-0 overflow-hidden">
          <div className="col-span-1 border-r border-cf-border h-full overflow-y-auto">
            <div className="space-y-2 p-4">
              {carePlan.modules.map((module: CarePlanModule) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModule(module)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${
                    selectedModule?.id === module.id
                      ? 'bg-cf-primary/10 border-cf-primary'
                      : 'border-cf-border hover:bg-cf-surface-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-cf-ink">
                        {module.name}
                      </p>
                      <p className="text-xs text-cf-ink-60 mt-1">
                        v{module.version}
                      </p>
                    </div>
                    {module.reviewStatus === 'overdue' && (
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Badge
                      variant={statusColors[module.reviewStatus] || 'pastel-info'}
                      className="text-xs"
                    >
                      {statusLabels[module.reviewStatus]}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 h-full overflow-y-auto">
            {selectedModule ? (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-cf-ink">
                      {selectedModule.name}
                    </h3>
                    <Badge
                      variant={statusColors[selectedModule.reviewStatus] || 'pastel-info'}
                    >
                      {statusLabels[selectedModule.reviewStatus]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-cf-ink-60 font-medium">Created</p>
                      <p className="text-cf-ink">{selectedModule.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-cf-ink-60 font-medium">Review Date</p>
                      <p className="text-cf-ink">{selectedModule.reviewDate}</p>
                    </div>
                    <div>
                      <p className="text-cf-ink-60 font-medium">Created By</p>
                      <p className="text-cf-ink">{selectedModule.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-cf-ink-60 font-medium">Last Reviewed</p>
                      <p className="text-cf-ink">{selectedModule.lastReviewedBy}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cf-border pt-4">
                  {renderModuleView(selectedModule)}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-cf-ink-60">
                Select a module to view details
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}