'use client';

import { PermissionsAlerts } from "./permission-alets";
import { PermissionsList } from "./permission-list";
import type { PermissionsBodyProps } from "types";

export function PermissionsBody({
  permissions,
  expandedModules,
  onToggleModule,
  onTogglePermission,
  onToggleAllModule,
  error,
  success,
}: PermissionsBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
      <PermissionsAlerts error={error} success={success} />

      <PermissionsList
        permissions={permissions}
        expandedModules={expandedModules}
        onToggleModule={onToggleModule}
        onTogglePermission={onTogglePermission}
        onToggleAllModule={onToggleAllModule}
      />
    </div>
  );
}