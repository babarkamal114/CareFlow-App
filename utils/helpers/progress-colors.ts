export const getProgressColor = (score: number): string => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 70) return 'bg-amber-500'
  if (score >= 50) return 'bg-orange-500'
  return 'bg-red-500'
}

export const getStatusFromScore = (score: number): {
  status: 'good' | 'needs-improvement' | 'requires-action'
  label: string
  badgeVariant: 'pastel-success' | 'pastel-warning' | 'pastel-danger'
} => {
  if (score >= 85) {
    return {
      status: 'good',
      label: 'Good',
      badgeVariant: 'pastel-success',
    }
  }
  if (score >= 70) {
    return {
      status: 'needs-improvement',
      label: 'Needs Improvement',
      badgeVariant: 'pastel-warning',
    }
  }
  return {
    status: 'requires-action',
    label: 'Requires Action',
    badgeVariant: 'pastel-danger',
  }
}

export const getIconColor = (score: number): string => {
  if (score >= 85) return 'text-green-600 dark:text-green-400'
  if (score >= 70) return 'text-amber-600 dark:text-amber-400'
  if (score >= 50) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}