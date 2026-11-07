"use client";

import { useEffect, useMemo, useState } from "react";
import type { DefaultPermission, PermissionsMap, PermissionsModalProps } from "types";
import { ALL_MODULES } from "utils";
import {
  buildInitialPermissions,
  toggleAllModuleActions,
  togglePermissionAction,
  toggleSetValue,
} from "utils";

type UsePermissionsModalArgs = {
  open: boolean;
  defaultPermissions: DefaultPermission[];
  onSave?: PermissionsModalProps["onSave"];
};

export function usePermissionsModal({ open, defaultPermissions, onSave }: UsePermissionsModalArgs) {
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionsMap>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const memoizedDefaults = useMemo(() => defaultPermissions, [JSON.stringify(defaultPermissions)]);

  useEffect(() => {
    if (!open) return;
    setPermissions(buildInitialPermissions(ALL_MODULES, memoizedDefaults ?? []));
    setExpandedModules(new Set(ALL_MODULES.map((m) => m.id)));
  }, [open, memoizedDefaults]);

  const togglePermission = (moduleId: string, action: string) =>
    setPermissions((prev) => togglePermissionAction(prev, moduleId, action));

  const toggleAllModule = (moduleId: string) => {
    const module = ALL_MODULES.find((m) => m.id === moduleId);
    if (!module) return;
    setPermissions((prev) => toggleAllModuleActions(prev, module));
  };

  const toggleModule = (moduleId: string) =>
    setExpandedModules((prev) => toggleSetValue(prev, moduleId));

  const handleSubmit = async () => {
    setError(null);
    try {
      if (onSave) await onSave({ permissions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    permissions,
    expandedModules,
    error,
    togglePermission,
    toggleAllModule,
    toggleModule,
    handleSubmit,
  };
}
