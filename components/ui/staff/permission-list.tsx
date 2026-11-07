'use client';

import { ALL_MODULES } from "utils";
import { PermissionRow } from "./permission-row";
import type { PermissionsListProps } from "types";



export function PermissionsList({
  permissions,
  expandedModules,
  onToggleModule,
  onTogglePermission,
  onToggleAllModule,
}: PermissionsListProps) {
  return (
    <div className="space-y-3">
      {ALL_MODULES.map((module) => (
        <PermissionRow
          key={module.id}
          module={module}
          permissions={permissions}
          isExpanded={expandedModules.has(module.id)}
          onToggleModule={onToggleModule}
          onTogglePermission={onTogglePermission}
          onToggleAllModule={onToggleAllModule}
        />
      ))}
    </div>
  );
}