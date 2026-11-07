'use client';

import {
  Dialog,
  DialogContent,
} from "@/components/ui";
import PermissionsHeader from './PermissionHeader';
import { PermissionsBody } from "@/components/ui";
import PermissionsFooter from './PermissionFooter';
import type { PermissionsModalProps } from "types";
import { usePermissionsModal } from "hooks";

export function PermissionsModal({
  staff,
  open,
  onOpenChange,
  onSave,
  defaultPermissions = [],
  isLoading: isSaving = false,
  isSuccess,
}: PermissionsModalProps) {
  const {
    permissions,
    expandedModules,
    error,
    togglePermission,
    toggleAllModule,
    toggleModule,
    handleSubmit,
  } = usePermissionsModal({ open, defaultPermissions, onSave });

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