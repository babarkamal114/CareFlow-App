"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { getMockStaffProfile, mapRolesToDisplay, useGetAllRolesApi, useGrantUserPermissionsApi } from "lib";
import type { StaffMember } from "types";
import type { StaffDrawerTabId,  } from "utils";
import { OVERFLOW_TABS } from "utils";

export function useStaffViewDrawer(staff: StaffMember | null) {
  const [activeTab, setActiveTab] = useState<StaffDrawerTabId>("profile");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: session } = useSession();

  const agencyId = session?.user.agencyId;
  const accessToken = session?.accessToken;

  const { mutate: grantPermissions, isPending, isSuccess } =
    useGrantUserPermissionsApi(staff?.userId ?? "");

  const { data: rolesData } = useGetAllRolesApi();
  const roles = useMemo(() => mapRolesToDisplay(rolesData?.roles), [rolesData]);

  const profile = useMemo(() => (staff ? getMockStaffProfile(staff) : null), [staff]);

  const managerId = profile?.data.managerId;
  const managerRole = roles.find((role) => role.id === managerId);
  const managerName = managerRole?.displayName ?? managerRole?.name;

  const counts: Partial<Record<StaffDrawerTabId, number>> = profile
    ? {
        documents: profile.data.documents.length,
        training: profile.data.mandatoryTraining.length,
      }
    : {};

  const isOverflowActive = OVERFLOW_TABS.includes(activeTab);

  const handleSavePermissions = async (data: { permissions: Record<string, string[]> }) => {
    if (!accessToken || !agencyId) return;
    grantPermissions({ accessToken, agencyId, permissions: data.permissions });
  };

  const handleEmail = () => {
    if (staff?.email) window.location.href = `mailto:${staff.email}`;
  };

  return {
    activeTab,
    setActiveTab,
    editModalOpen,
    setEditModalOpen,
    agencyId,
    accessToken,
    profile,
    managerName,
    counts,
    isOverflowActive,
    isSavingPermissions: isPending,
    isPermissionsSuccess: isSuccess,
    handleSavePermissions,
    handleEmail,
  };
}
