'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui";
import { StaffMember } from "types";
import { ALL_MODULES } from "utils";
import PermissionsHeader from './PermissionHeader';
import { PermissionsBody } from "@/components/ui";
import PermissionsFooter from './PermissionFooter';

interface PermissionsModalProps {
  staff: StaffMember;
  defaultPermissions?: Array<{ module: string; action: string; source?: string }>;
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
  const [success, setSuccess] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const memoizedDefaultPermissions = useMemo(() => defaultPermissions, [
    JSON.stringify(defaultPermissions),
  ]);

  useEffect(() => {
    if (open) {
      const initialPermissions: Record<string, string[]> = {};

      ALL_MODULES.forEach((module) => {
        initialPermissions[module.id] = [];
      });

      if (memoizedDefaultPermissions && memoizedDefaultPermissions.length > 0) {
        memoizedDefaultPermissions.forEach((perm) => {
          if (perm.source !== 'block') {
            if (!initialPermissions[perm.module]) {
              initialPermissions[perm.module] = [];
            }
            if (!initialPermissions[perm.module].includes(perm.action)) {
              initialPermissions[perm.module].push(perm.action);
            }
          }
        });
      }

      setPermissions(initialPermissions);
      setExpandedModules(new Set(ALL_MODULES.map((m) => m.id)));
    }
  }, [open, memoizedDefaultPermissions]);

  const togglePermission = (moduleId: string, action: string) => {
    setPermissions((prev) => {
      const current = prev[moduleId] || [];
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];
      return { ...prev, [moduleId]: updated };
    });
  };

  const toggleAllModule = (moduleId: string) => {
    const module = ALL_MODULES.find((m) => m.id === moduleId);
    if (!module) return;

    setPermissions((prev) => {
      const current = prev[moduleId] || [];
      const allGranted = module.actions.every((a) => current.includes(a));
      const updated = allGranted ? [] : [...module.actions];
      return { ...prev, [moduleId]: updated };
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      if (onSave) {
        await onSave({ permissions });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="screen" showCloseButton={true} className="flex flex-col p-0 gap-0">
        <PermissionsHeader staff={staff} permissions={permissions} />

        <PermissionsBody
          permissions={permissions}
          expandedModules={expandedModules}
          onToggleModule={toggleModule}
          onTogglePermission={togglePermission}
          onToggleAllModule={toggleAllModule}
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