import type { Carer } from 'types';
import { MOCK_PATIENT_CARERS } from '@/lib/mock/patients-mock-data';

export function fetchCarers(): Promise<Carer[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PATIENT_CARERS]), 500));
}

export function toggleCarer(selectedIds: string[], carerId: string): string[] {
  return selectedIds.includes(carerId)
    ? selectedIds.filter((id) => id !== carerId)
    : [...selectedIds, carerId];
}

export function getCarerName(carers: Carer[], carerId: string): string | undefined {
  return carers.find((c) => c.id === carerId)?.name;
}