"use client";

import { useMemo, useState } from "react";
import { useGetUserPermissionsApi } from "lib";
import type { StaffPermissionTabProps } from "types";
import { PERMISSION_MODULES } from "utils";
import {
  buildPermissionMap,
  countConfiguredModules,
  hasPermission as hasPermissionIn,
} from "utils";

type UseStaffPermissionTabArgs = Pick<StaffPermissionTabProps, "staff" | "agencyId" | "accessToken">;

export function useStaffPermissionTab({ staff, agencyId, accessToken }: UseStaffPermissionTabArgs) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: permissionData, isLoading, error } = useGetUserPermissionsApi(
    agencyId ?? "",
    staff?.userId ?? "",
    accessToken ?? ""
  );

  const permissionMap = useMemo(() => buildPermissionMap(permissionData), [permissionData]);

  const hasPermission = (module: string, action: string) =>
    hasPermissionIn(permissionMap, module, action);

  const configuredModuleCount = countConfiguredModules(PERMISSION_MODULES, permissionMap);

  return {
    isModalOpen,
    setIsModalOpen,
    permissionData,
    isLoading,
    error,
    hasPermission,
    configuredModuleCount,
  };
}
