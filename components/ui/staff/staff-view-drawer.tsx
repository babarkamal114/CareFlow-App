'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
  Button, Badge,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui';
import { FileText, UserX, X, MoreHorizontal } from 'lucide-react';
import type { StaffMember } from 'types';
import {
  EditStaffModal, StaffDetailedTab, StaffActivityTab, StaffPermissionTab, StaffDocumentsTab,
} from 'sections';
import {
  getRoleBadgeColor, getRoleDisplayName, getStatusBadgeColor, formatTime,
  getStatusDotClass, getStaffInitials,
  STAFF_VIEW_TABS, staffTabContentVariants, DEFAULT_STAFF_VIEW_TAB,
  STAFF_QUICK_ACTIONS, STAFF_QUICK_ACTION_CLASS,
  STAFF_FOOTER_ACTIONS, STAFF_FOOTER_BUTTON_CLASS,
  type StaffViewTabId,
} from 'utils';
import { StaffViewTabs } from './staff-view-tabs';
import { useSession } from 'next-auth/react';
import { useGrantUserPermissionsApi } from 'lib';

interface StaffViewDrawerProps {
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TabContentContext {
  staff: StaffMember;
  accessToken: string;
  agencyId: string;
  onSavePermissions: (data: { permissions: Record<string, string[]> }) => Promise<void>;
  isSavingPermissions: boolean;
  isSuccess: boolean;
}

// JSX per tab lives here (not in utils) — a lookup replaces the old switch.
const TAB_CONTENT: Record<StaffViewTabId, (ctx: TabContentContext) => ReactNode> = {
  details: ({ staff }) => <StaffDetailedTab staff={staff} />,
  permissions: (ctx) => (
    <StaffPermissionTab
      staff={ctx.staff}
      accessToken={ctx.accessToken}
      agencyId={ctx.agencyId}
      onSavePermissions={ctx.onSavePermissions}
      isSavingPermissions={ctx.isSavingPermissions}
      isSuccess={ctx.isSuccess}
    />
  ),
  activity: ({ staff }) => <StaffActivityTab staff={staff} />,
  documents: ({ staff }) => <StaffDocumentsTab staff={staff} />,
};

export function StaffViewDrawer({ staff, open, onOpenChange }: StaffViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<StaffViewTabId>(DEFAULT_STAFF_VIEW_TAB);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { data: userData } = useSession();

  const agencyId = userData?.user.agencyId;
  const accessToken = userData?.accessToken;

  const { mutate: grantPermissions, isPending, isSuccess } =
    useGrantUserPermissionsApi(staff?.userId!);

  const handleSavePermissions = async (data: { permissions: Record<string, string[]> }) => {
    grantPermissions({
      accessToken: accessToken!,
      agencyId: agencyId!,
      permissions: data.permissions,
    });
  };

  const handleQuickAction = (href?: string) => {
    if (href) window.location.href = href;
  };

  if (!staff) return null;

  return (
    <TooltipProvider>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="h-screen max-w-2xl flex flex-col">
          <DrawerHeader className="shrink-0 border-b border-border px-6 pb-5 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="relative shrink-0">
                  {staff.profilePicture ? (
                    <img
                      src={staff.profilePicture}
                      alt={staff.name}
                      className="h-14 w-14 rounded-xl border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-muted text-lg font-semibold text-foreground">
                      {getStaffInitials(staff.name)}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${getStatusDotClass(
                      staff.status,
                    )}`}
                  />
                </div>

                <div className="min-w-0 pt-0.5">
                  <DrawerTitle className="text-xl font-bold text-foreground leading-tight truncate">
                    {staff.name}
                  </DrawerTitle>
                  <p className="text-sm text-muted-foreground truncate">{staff.email}</p>

                  <div className="flex items-center gap-2 flex-wrap mt-2.5">
                    <Badge variant={getRoleBadgeColor(staff.role)} shape="pill" badgeSize="md">
                      {getRoleDisplayName(staff.role)}
                    </Badge>
                    <Badge variant={getStatusBadgeColor(staff.status)} shape="pill" badgeSize="md">
                      {staff.status}
                    </Badge>
                    {!staff.emailVerified && (
                      <Badge variant="pastel-orange" badgeSize="md" shape="rounded">
                        Email not verified
                      </Badge>
                    )}
                  </div>

                  {staff.updatedAt && (
                    <p className="text-xs text-cf-ink-40 mt-2">
                      Last active {formatTime(staff.updatedAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-1 shrink-0">
                {STAFF_QUICK_ACTIONS.map(({ id, label, icon: Icon, getHref }) => (
                  <Tooltip key={id}>
                    <TooltipTrigger
                      onClick={() => handleQuickAction(getHref?.(staff))}
                      className={STAFF_QUICK_ACTION_CLASS}
                    >
                      <Icon className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
                <DrawerClose
                  render={
                    <Button
                      type="button"
                      className={STAFF_QUICK_ACTION_CLASS}
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  }
                />
              </div>
            </motion.div>
          </DrawerHeader>

          <StaffViewTabs
            tabs={STAFF_VIEW_TABS}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as StaffViewTabId)}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={staffTabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {TAB_CONTENT[activeTab]({
                  staff,
                  accessToken: accessToken!,
                  agencyId: agencyId!,
                  onSavePermissions: handleSavePermissions,
                  isSavingPermissions: isPending,
                  isSuccess,
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <DrawerFooter className="flex flex-row items-center gap-2 border-t border-border px-6 py-4">
            <Button
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Edit details
            </Button>

            {STAFF_FOOTER_ACTIONS.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                className={STAFF_FOOTER_BUTTON_CLASS}
              >
                <Icon className="mr-1.5 h-3.5 w-3.5" />
                {label}
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className={`ml-auto ${STAFF_FOOTER_BUTTON_CLASS}`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                    <span className="sr-only">More actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem className="text-error">
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <EditStaffModal staff={staff} open={editModalOpen} onOpenChange={setEditModalOpen} />
    </TooltipProvider>
  );
}