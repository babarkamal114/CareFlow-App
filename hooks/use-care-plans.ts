'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from '@/components/ui';
import type { CarePlan, ModuleCreationData } from "types";
import { getMockPatientById, mockCarePlansList } from "utils";
import { buildCarePlanFromCreation } from "utils";

export function useCarePlans() {
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlansList);

  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [creationPatientId, setCreationPatientId] = useState<string | undefined>(undefined);

  const patientNames = useMemo(
    () =>
      carePlans.reduce<Record<string, string>>((acc, plan) => {
        acc[plan.patientId] = plan.patientName;
        return acc;
      }, {}),
    [carePlans]
  );
  const creationPatientName = creationPatientId ? getMockPatientById(creationPatientId)?.name : undefined;

  const openCreate = useCallback(() => {
    setCreationPatientId(undefined);
    setIsCreationModalOpen(true);
  }, []);

  const openCreateForPatient = useCallback((patientId: string) => {
    if (!getMockPatientById(patientId)) {
      toast.info('We could not find that patient', { description: 'The plan will be created without patient details.' });
    }
    setCreationPatientId(patientId);
    setIsCreationModalOpen(true);
  }, []);

  const onCreationOpenChange = useCallback((open: boolean) => {
    setIsCreationModalOpen(open);
    if (!open) setCreationPatientId(undefined);
  }, []);

  const handleCreationComplete = useCallback((data: ModuleCreationData) => {
  const created = buildCarePlanFromCreation(data);

  setCarePlans((prev) => {
    const existing = prev.find((plan) => plan.patientId === created.patientId);
    if (!existing) return [created, ...prev];
    return prev.map((plan) =>
      plan.id === existing.id ? { ...plan, modules: [...plan.modules, ...created.modules] } : plan
    );
  });

  toast.success('Care Plan created successfully!', {
    description: `Added "${data.name}" to vault`,
  });
  setIsCreationModalOpen(false);
  setCreationPatientId(undefined);
  }, []);

  return {
    carePlans,
    patientNames,
    activeFilterTab,
    setActiveFilterTab,
    searchQuery,
    setSearchQuery,
    isCreationModalOpen,
    creationPatientId,
    creationPatientName,
    openCreate,
    openCreateForPatient,
    onCreationOpenChange,
    handleCreationComplete,
  };
}