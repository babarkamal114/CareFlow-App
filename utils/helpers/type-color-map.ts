
export const typeColorMap: Record<string, string> = {
  'initial-assessment': 'text-cf-amber-500',
  'care-visit': 'text-cf-blue-500',
  'appointment': 'text-cf-purple-500',
  'medication': 'text-success',
  'follow-up': 'text-teal-600',
  'review': 'text-indigo-600',
  'emergency': 'text-cf-red-500',
  'default': 'text-cf-ink-60',
};

export const borderColorMap: Record<string, string> = {
  'initial-assessment': 'border-l-cf-amber-500',
  'care-visit': 'border-l-cf-blue-500',
  'appointment': 'border-l-cf-purple-500',
  'medication': 'border-l-cf-green-500',
  'follow-up': 'border-l-cf-teal-500',
  'review': 'border-l-cf-indigo-500',
  'emergency': 'border-l-cf-red-500',
  'default': 'border-l-cf-ink-40',
};

export const reasonColorMap: Record<string, string> = {
  'new-patient': 'text-cf-amber-500',
  'urgent': 'text-cf-red-500',
  'follow-up': 'text-cf-blue-500',
  'routine': 'text-cf-green-500',
  'default': 'text-cf-ink-60',
};

export function getTypeColor(typeKey: string): string {
  return typeColorMap[typeKey] || typeColorMap.default;
}

export function getBorderColor(typeKey: string): string {
  return borderColorMap[typeKey] || borderColorMap.default;
}

export function getReasonColor(reasonKey: string): string {
  return reasonColorMap[reasonKey] || reasonColorMap.default;
}