'use client';

import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from "@/components/ui"
import { useGetUserPermissionsApi } from "lib";
import { StaffMember } from "types";
import { PERMISSION_MODULES } from '@/utils';
import { PermissionsModal } from './PermissionsModal';
import { Button } from "@/components/ui"
import { Shield, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { PermissionTableSkeleton } from "@/components/ui";

export const PERMISSIONS_TABLE_HEADER_COLUMNS = [
  { label: 'Module' },
  { label: 'Read' },
  { label: 'Create' },
  { label: 'Update' },
  { label: 'Delete' },
  { label: 'All' },
];

export interface StaffPermissionTabProps {
  staff: StaffMember;
  agencyId: string;
  accessToken: string;
  onSavePermissions: (data: { permissions: Record<string, string[]> }) => Promise<void>;
  isSavingPermissions: boolean;
  isSuccess: boolean;

}

const StaffPermissionTab = ({
  accessToken,
  agencyId,
  staff,
  onSavePermissions,
  isSavingPermissions,
  isSuccess,
}: StaffPermissionTabProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: permissionData, isLoading, error } = useGetUserPermissionsApi(
    agencyId!,
    staff?.userId!,
    accessToken!
  );



  const permissionMap = new Map<string, string>();
  permissionData?.forEach((perm) => {
    permissionMap.set(`${perm.module}:${perm.action}`, perm.source);
  });



  const hasPermission = (module: string, action: string) => {
    const source = permissionMap.get(`${module.toLowerCase()}:${action}`);
    return source !== undefined && source !== 'block';
  };

  const isAllGranted = (module: string): boolean => {
    const moduleData = PERMISSION_MODULES.find((m) => m.id === module);
    if (!moduleData) return false;
    return moduleData.actions.every((action) => hasPermission(module, action));
  };

  if (isLoading) {
    return (<PermissionTableSkeleton />);
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-cf-border py-12 text-center">
        <ShieldAlert className="h-8 w-8 text-cf-ink-40" />
        <p className="text-sm text-cf-ink-60">Permissions not found for this user</p>
      </div>
    );
  }

  const configuredModuleCount = PERMISSION_MODULES.filter((module) =>
    module.actions.some((action) => hasPermission(module.id, action)),
  ).length;

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-cf-ink-60">
          <Shield className="h-4 w-4" />
          <span>
            {configuredModuleCount} of {PERMISSION_MODULES.length} modules have access configured
          </span>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Shield className="w-4 h-4 mr-2" />
          Manage Permissions
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {PERMISSIONS_TABLE_HEADER_COLUMNS.map((header) => (
                <TableHead
                  key={header.label}
                  className={header.label !== 'Module' ? 'text-center' : undefined}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_MODULES.map((module, index) => {
              const hasRead = hasPermission(module.id, 'read');
              const hasCreate = hasPermission(module.id, 'create');
              const hasUpdate = hasPermission(module.id, 'update');
              const hasDelete = hasPermission(module.id, 'delete');
              const hasAll = hasPermission(module.id, 'all');
              const grantedCount = [hasRead, hasCreate, hasUpdate, hasDelete].filter(Boolean).length;

              return (
                <TableRow
                  key={module.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300"
                  style={{ animationDelay: `${index * 35}ms`, animationFillMode: 'backwards' }}
                >
                  <TableCell className="font-medium text-cf-ink">
                    <div className="flex items-center gap-2">
                      {module.label}
                      {grantedCount === 0 && !hasAll && (
                        <Badge
                          variant="outline"
                          className="border-cf-border text-[10px] font-normal text-cf-ink-40"
                        >
                          No access
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {module.actions.includes('read') ? (
                      <Checkbox
                        checked={hasRead}
                        className="mx-auto transition-transform duration-150 data-checked:scale-110"
                      />
                    ) : (
                      <Checkbox className="mx-auto" disabled />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {module.actions.includes('create') ? (
                      <Checkbox
                        checked={hasCreate}
                        className="mx-auto transition-transform duration-150 data-checked:scale-110"
                      />
                    ) : (
                      <Checkbox className="mx-auto" disabled />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {module.actions.includes('update') ? (
                      <Checkbox
                        checked={hasUpdate}
                        className="mx-auto transition-transform duration-150 data-checked:scale-110"
                      />
                    ) : (
                      <Checkbox className="mx-auto" disabled />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {module.actions.includes('delete') ? (
                      <Checkbox
                        checked={hasDelete}
                        className="mx-auto transition-transform duration-150 data-checked:scale-110"
                      />
                    ) : (
                      <Checkbox className="mx-auto" disabled />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {module.actions.includes('all') ? (
                      <Checkbox
                        checked={hasAll}
                        className="mx-auto transition-transform duration-150 data-checked:scale-110 data-checked:border-cf-primary data-checked:bg-cf-primary"
                      />
                    ) : (
                      <Checkbox className="mx-auto" disabled />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <PermissionsModal
        staff={staff}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultPermissions={permissionData}
        onSave={onSavePermissions}
        isLoading={isSavingPermissions}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default StaffPermissionTab;