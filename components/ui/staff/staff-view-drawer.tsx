'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check, KeyRound, Mail, MoreVertical, RotateCcw } from 'lucide-react';
import {
  Badge,
  Button,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
  Tabs,
  TabsContent,
  TooltipProvider,
} from '@/components/ui';
import {
  EditStaffModal,
  StaffActivityTab,
  StaffAvailabilityTab,
  StaffDocumentsTab,
  StaffEmploymentTab,
  StaffPermissionTab,
  StaffProfileTab,
  StaffTrainingTab,
  StaffVettingTab,
} from 'sections';
import { getMockStaffProfile, mapRolesToDisplay, useGetAllRolesApi, useGrantUserPermissionsApi } from 'lib';
import type { StaffMember } from 'types';
import type { StaffDrawerTabId } from 'utils';
import { StaffDrawerHeader } from './staff-drawer-header';

const PANEL_CLASS = 'px-4 pb-6 pt-5 sm:px-6';

// 4 visible tabs — the rest live under the 3-dot menu
const PRIMARY_TABS: StaffDrawerTabId[] = ['profile', 'employment', 'vetting', 'training'];
const OVERFLOW_TABS: StaffDrawerTabId[] = ['availability', 'documents', 'permissions', 'activity'];

const TAB_LABELS: Record<StaffDrawerTabId, string> = {
  profile: 'Profile',
  employment: 'Employment',
  vetting: 'Vetting',
  training: 'Training',
  availability: 'Availability',
  documents: 'Documents',
  permissions: 'Permissions',
  activity: 'Activity',
};

interface StaffViewDrawerProps {
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffViewDrawer({ staff, open, onOpenChange }: StaffViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<StaffDrawerTabId>('profile');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: session } = useSession();

  const agencyId = session?.user.agencyId;
  const accessToken = session?.accessToken;

  const { mutate: grantPermissions, isPending, isSuccess } =
    useGrantUserPermissionsApi(staff?.userId ?? '');

  const { data: rolesData } = useGetAllRolesApi();
  const roles = useMemo(() => mapRolesToDisplay(rolesData?.roles), [rolesData]);

  const profile = useMemo(
    () => (staff ? getMockStaffProfile(staff) : null),
    [staff]
  );

  const managerId = profile?.data.managerId;
  const managerRole = roles.find((role) => role.id === managerId);
  const managerName = managerRole?.displayName ?? managerRole?.name;

  if (!staff || !profile) return null;

  const { data } = profile;

  const handleSavePermissions = async (permissions: {
    permissions: Record<string, string[]>;
  }) => {
    if (!accessToken || !agencyId) return;
    grantPermissions({ accessToken, agencyId, permissions: permissions.permissions });
  };

  const counts = {
    documents: data.documents.length,
    training: data.mandatoryTraining.length,
  } as Partial<Record<StaffDrawerTabId, number>>;

  const isOverflowActive = OVERFLOW_TABS.includes(activeTab);

  return (
    <TooltipProvider>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="flex h-screen max-w-3xl flex-col">
          <StaffDrawerHeader
            staff={staff}
            employmentType={data.employmentType}
            compliance={profile.compliance}
            onEmail={() => {
              if (staff.email) window.location.href = `mailto:${staff.email}`;
            }}
            onSms={() => undefined}
            onClose={() => onOpenChange(false)}
          />

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as StaffDrawerTabId)}
            className="flex min-h-0 flex-1 flex-col gap-0"
          >
            {/* ── Tab bar: 4 visible tabs + 3-dot overflow ── */}
            <div className="flex items-center gap-1 border-b border-cf-border px-4 sm:px-6">
              {PRIMARY_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Button
                    key={tab}
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-state={isActive ? 'active' : 'inactive'}
                    onClick={() => setActiveTab(tab)}
                    className={`relative gap-1.5 rounded-none border-b-2 border-transparent px-3 text-sm font-medium transition-colors hover:bg-transparent ${
                      isActive
                        ? 'border-cf-primary text-cf-ink'
                        : 'text-cf-ink-60 hover:text-cf-ink'
                    }`}
                  >
                    {TAB_LABELS[tab]}
                    {counts[tab] !== undefined && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                        {counts[tab]}
                      </Badge>
                    )}
                  </Button>
                );
              })}

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="More tabs"
                      data-state={isOverflowActive ? 'active' : 'inactive'}
                      className={`ml-auto size-8 rounded-none border-b-2 border-transparent hover:bg-transparent ${
                        isOverflowActive
                          ? 'border-cf-primary text-cf-ink'
                          : 'text-cf-ink-60 hover:text-cf-ink'
                      }`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48">
                  {OVERFLOW_TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <DropdownMenuItem
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {isActive && <Check className="size-4 text-cf-primary" />}
                          <span className={isActive ? 'font-medium text-cf-ink' : ''}>
                            {TAB_LABELS[tab]}
                          </span>
                        </span>
                        {counts[tab] !== undefined && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {counts[tab]}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <TabsContent value="profile" className={PANEL_CLASS}>
                <StaffProfileTab staff={staff} profile={profile} />
              </TabsContent>
              <TabsContent value="employment" className={PANEL_CLASS}>
                <StaffEmploymentTab profile={profile} managerName={managerName} />
              </TabsContent>
              <TabsContent value="vetting" className={PANEL_CLASS}>
                <StaffVettingTab profile={profile} />
              </TabsContent>
              <TabsContent value="training" className={PANEL_CLASS}>
                <StaffTrainingTab profile={profile} />
              </TabsContent>
              <TabsContent value="availability" className={PANEL_CLASS}>
                <StaffAvailabilityTab profile={profile} />
              </TabsContent>
              <TabsContent value="documents" className={PANEL_CLASS}>
                <StaffDocumentsTab profile={profile} />
              </TabsContent>
              <TabsContent value="permissions" className={PANEL_CLASS}>
                <StaffPermissionTab
                  staff={staff}
                  accessToken={accessToken ?? ''}
                  agencyId={agencyId ?? ''}
                  onSavePermissions={handleSavePermissions}
                  isSavingPermissions={isPending}
                  isSuccess={isSuccess}
                />
              </TabsContent>
              <TabsContent value="activity" className={PANEL_CLASS}>
                <StaffActivityTab staff={staff} />
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DrawerFooter className="flex-row items-center gap-2 border-t border-cf-border px-6 py-4">
            <Button size="sm" onClick={() => setEditModalOpen(true)}>
              Edit details
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto border-cf-border text-cf-ink-60"
                  >
                    More
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => undefined}>
                  <RotateCcw className="mr-2 size-4" />
                  Reset password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => undefined}>
                  <Mail className="mr-2 size-4" />
                  Resend invitation
                </DropdownMenuItem>
                <DropdownMenuItem className="text-cf-error">
                  <KeyRound className="mr-2 size-4" />
                  Deactivate account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <EditStaffModal
        staff={staff}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </TooltipProvider>
  );
}