'use client';

import { ALL_MODULES } from "utils";
import { PermissionRow } from "./permission-row";



interface PermissionsListProps {
  permissions: Record<string, string[]>;
  expandedModules: Set<string>;
  onToggleModule: (id: string) => void;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

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