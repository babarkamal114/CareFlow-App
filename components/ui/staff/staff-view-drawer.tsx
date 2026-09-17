'use client';

import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  Button,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  BadgeProps,
} from '@/components/ui';
import {
  Mail,
  MessageSquare,
  FileText,
  Lock,
  Clock,
  UserX,
  X,
  MoreHorizontal,
  KeyRound,
  Send,
} from 'lucide-react';
import type { StaffMember } from 'types';
import {
  EditStaffModal,
  StaffDetailedTab,
  StaffActivityTab,
  StaffPermissionTab,

} from 'sections';
import {
  getRoleBadgeColor,
  getRoleDisplayName,
  getStatusBadgeColor,
  formatTime,
} from 'utils';
import { StaffViewTabs } from './staff-view-tabs';
import { useSession } from 'next-auth/react';
import { useGrantUserPermissionsApi } from 'lib';
import { StaffDocumentsTab } from 'sections';

type TabType = 'details' | 'permissions' | 'activity' | 'documents';

interface StaffViewDrawerProps {
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getStatusDotClass(status: string) {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-500';
    case 'PENDING':
    case 'INVITED':
      return 'bg-amber-400';
    case 'SUSPENDED':
    case 'INACTIVE':
      return 'bg-cf-ink-40';
    default:
      return 'bg-cf-ink-20';
  }
}

const tabContentVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function StaffViewDrawer({ staff, open, onOpenChange }: StaffViewDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
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

  if (!staff) return null;

  const tabs = [
    { id: 'details' as const, label: 'Details', icon: FileText },
    { id: 'permissions' as const, label: 'Permissions', icon: Lock },
    { id: 'activity' as const, label: 'Activity', icon: Clock },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <StaffDetailedTab staff={staff} />;
      case 'permissions':
        return (
          <StaffPermissionTab
            staff={staff}
            accessToken={accessToken!}
            agencyId={agencyId!}
            onSavePermissions={handleSavePermissions}
            isSavingPermissions={isPending}
            isSuccess={isSuccess}
          />
        );
      case 'activity':
        return <StaffActivityTab staff={staff} />;
      case 'documents':
        return <StaffDocumentsTab staff={staff} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="h-screen max-w-2xl flex flex-col">
          
          <DrawerHeader className="shrink-0 border-b border-cf-border px-6 pb-5 pt-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="relative flex-shrink-0">
                  {staff.profilePicture ? (
                    <img
                      src={staff.profilePicture}
                      alt={staff.name}
                      className="h-14 w-14 rounded-xl border border-cf-border object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-cf-border bg-cf-surface-muted text-lg font-semibold text-cf-ink">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-cf-surface ${getStatusDotClass(
                      staff.status,
                    )}`}
                  />
                </div>

                <div className="min-w-0 pt-0.5">
                  <DrawerTitle className="text-xl font-bold text-cf-ink leading-tight truncate">
                    {staff.name}
                  </DrawerTitle>
                  <p className="text-sm text-cf-ink-60 truncate">{staff.email}</p>

                  <div className="flex items-center gap-2 flex-wrap mt-2.5">
                    <Badge
                      variant={getRoleBadgeColor(staff.role)}
                      shape={'pill'}
                      badgeSize={'md'}
                      
                    >
                      {getRoleDisplayName(staff.role)}
                    </Badge>
                    <Badge
                      variant={getStatusBadgeColor(staff.status) as BadgeProps['variant']}
                      shape={'pill'}
                      badgeSize={'md'}
                    >
                      {staff.status}
                    </Badge>
                    {!staff.emailVerified && (
                      <Badge
                        variant="pastel-orange"
                        badgeSize={'md'}
                        shape={'rounded'}
                        
                      >
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
              <div className="flex items-center gap-1 flex-shrink-0">
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => staff.email && (window.location.href = `mailto:${staff.email}`)}
                    className="rounded-lg p-2 text-cf-ink-60 transition-all duration-200 hover:scale-110 hover:bg-cf-surface-muted hover:text-cf-ink active:scale-95"
                  >
                    <Mail className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>Send email</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="rounded-lg p-2 text-cf-ink-60 transition-all duration-200 hover:scale-110 hover:bg-cf-surface-muted hover:text-cf-ink active:scale-95">
                    <MessageSquare className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>Send SMS</TooltipContent>
                </Tooltip>
                <DrawerClose
                  render={
                    <button
                      type="button"
                      className="rounded-lg p-2 text-cf-ink-60 transition-all duration-200 hover:scale-110 hover:bg-cf-surface-muted hover:text-cf-ink active:scale-95"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  }
                />
              </div>
            </motion.div>
          </DrawerHeader>

          <StaffViewTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab as any} />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <DrawerFooter className="flex flex-row items-center gap-2 border-t border-cf-border px-6 py-4">
            <Button
              size="sm"
              onClick={() => setEditModalOpen(true)}
              className="transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Edit details
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-cf-border text-cf-ink-60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cf-surface-muted hover:text-cf-ink active:translate-y-0"
            >
              <KeyRound className="mr-1.5 h-3.5 w-3.5" />
              Reset password
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-cf-border text-cf-ink-60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cf-surface-muted hover:text-cf-ink active:translate-y-0"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Resend invitation
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto border-cf-border text-cf-ink-60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cf-surface-muted hover:text-cf-ink active:translate-y-0"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                    <span className="sr-only">More actions</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem className="text-cf-error">
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