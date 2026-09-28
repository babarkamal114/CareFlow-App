export interface Carer {
  id: string;
  name: string;
}

const MOCK_CARERS: Carer[] = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emma Williams' },
  { id: '4', name: 'David Smith' },
  { id: '5', name: 'Lisa Garcia' },
];

export function fetchCarers(): Promise<Carer[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CARERS]), 500));
}

export function toggleCarer(selectedIds: string[], carerId: string): string[] {
  return selectedIds.includes(carerId)
    ? selectedIds.filter((id) => id !== carerId)
    : [...selectedIds, carerId];
}

export function getCarerName(carers: Carer[], carerId: string): string | undefined {
  return carers.find((c) => c.id === carerId)?.name;
}