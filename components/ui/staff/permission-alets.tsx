'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PermissionsAlertsProps {
  error: string | null;
  success: boolean;
}

export function PermissionsAlerts({ error, success }: PermissionsAlertsProps) {
  return (
    <>
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Permissions updated successfully</p>
        </div>
      )}
    </>
  );
}