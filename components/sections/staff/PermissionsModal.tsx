'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, PermissionsBody } from "@/components/ui";
import type { StaffMember } from "types";
import {
  ALL_MODULES,
  initializePermissions,
  togglePermissionAction,
  toggleAllModuleActions,
  getAllModuleIds,
  toggleSetValue,
  type RawPermission,
} from "utils";
import PermissionsHeader from './PermissionHeader';
import PermissionsFooter from './PermissionFooter';

interface PermissionsModalProps {
  staff: StaffMember;
  defaultPermissions?: RawPermission[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { permissions: Record<string, string[]> }) => Promise<void>;
  isLoading?: boolean;
  isSuccess: boolean;
}

export function PermissionsModal({
  staff,
  open,
  onOpenChange,
  onSave,
  defaultPermissions = [],
  isLoading: isSaving = false,
  isSuccess,
}: PermissionsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const memoizedDefaultPermissions = useMemo(
    () => defaultPermissions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(defaultPermissions)],
  );

  useEffect(() => {
    if (!open) return;
    setPermissions(initializePermissions(memoizedDefaultPermissions));
    setExpandedModules(getAllModuleIds(ALL_MODULES));
  }, [open, memoizedDefaultPermissions]);

  const handleTogglePermission = (moduleId: string, action: string) =>
    setPermissions((prev) => togglePermissionAction(prev, moduleId, action));

  const handleToggleAllModule = (moduleId: string) =>
    setPermissions((prev) => toggleAllModuleActions(prev, moduleId));

  const handleToggleModule = (moduleId: string) =>
    setExpandedModules((prev) => toggleSetValue(prev, moduleId));

  const handleSubmit = async () => {
    setError(null);
    try {
      await onSave?.({ permissions });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="screen" showCloseButton className="flex flex-col gap-0 p-0">
        <PermissionsHeader staff={staff} permissions={permissions} />

        <PermissionsBody
          permissions={permissions}
          expandedModules={expandedModules}
          onToggleModule={handleToggleModule}
          onTogglePermission={handleTogglePermission}
          onToggleAllModule={handleToggleAllModule}
          error={error}
          success={isSuccess}
        />

        <PermissionsFooter
          isLoading={isSaving}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}