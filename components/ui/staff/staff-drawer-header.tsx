'use client';

import { motion } from 'framer-motion';
import { CircleCheck, CircleSlash, MailWarning, ShieldAlert } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStatus,
  AvatarWrap,
  Badge,
  BadgeProps,
  DrawerDescription,
  DrawerTitle,
  Separator,
} from '@/components/ui';
import { COMPLIANCE_STATUS_LABELS, EMPLOYMENT_TYPE_LABELS } from 'types';
import type { ComplianceResult, EmploymentType, StaffMember } from 'types';
import {
  formatDate,
  formatTime,
  getRoleBadgeColor,
  getRoleDisplayName,
  getStaffComplianceTone,
  getStatusBadgeColor,
} from 'utils';
import { StaffDrawerActions } from './staff-drawer-actions';

const COMPLIANCE_TONE = {
  success: 'solidSuccess',
  warning: 'solidWarning',
  danger: 'solidDanger',
} as const;

const COMPLIANCE_ICON = {
  success: CircleCheck,
  warning: ShieldAlert,
  danger: CircleSlash,
} as const;

const STATUS_DOT_TONE = {
  ACTIVE: 'brand',
  SUSPENDED: 'red',
  TERMINATED: 'red',
} as const;

function getStatusDotTone(status: string) {
  return STATUS_DOT_TONE[status as keyof typeof STATUS_DOT_TONE] ?? 'amber';
}

interface StaffDrawerHeaderProps {
  staff: StaffMember;
  employmentType?: EmploymentType | '';
  compliance: ComplianceResult;
  onEmail: () => void;
  onSms: () => void;
  onClose: () => void;
}

export function StaffDrawerHeader({
  staff,
  employmentType,
  compliance,
  onEmail,
  onSms,
  onClose,
}: StaffDrawerHeaderProps) {
  const tone = getStaffComplianceTone(compliance.complianceStatus);
  const StatusIcon = COMPLIANCE_ICON[tone];

  return (
    <div className="shrink-0 space-y-3 border-b border-cf-border px-6 pb-4 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <AvatarWrap>
            <Avatar size="lg" shape="square">
              {staff.profilePicture ? (
                <AvatarImage src={staff.profilePicture} alt={staff.name} />
              ) : null}
              <AvatarFallback className="bg-cf-surface-muted text-cf-ink">
                {staff.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <AvatarStatus tone={getStatusDotTone(staff.status)} />
          </AvatarWrap>

          <div className="min-w-0 pt-0.5">
            <DrawerTitle className="truncate text-xl font-bold leading-tight text-cf-ink">
              {staff.name}
            </DrawerTitle>
            <DrawerDescription className="truncate text-sm text-cf-ink-60">
              {staff.email}
            </DrawerDescription>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge variant={getRoleBadgeColor(staff.role)} shape="pill" badgeSize="md">
                {getRoleDisplayName(staff.role)}
              </Badge>
              <Badge
                variant={getStatusBadgeColor(staff.status) as BadgeProps['variant']}
                shape="pill"
                badgeSize="md"
              >
                {staff.status}
              </Badge>
              {employmentType ? (
                <Badge variant="softMuted" badgeSize="md" shape="rounded">
                  {EMPLOYMENT_TYPE_LABELS[employmentType]}
                </Badge>
              ) : null}
              {staff.emailVerified ? null : (
                <Badge variant="pastel-orange" badgeSize="md" shape="rounded">
                  <MailWarning className="size-3" />
                  Email not verified
                </Badge>
              )}
            </div>

            <p className="mt-2 text-xs text-cf-ink-40">
              Joined {formatDate(staff.joinDate)} · Last active{' '}
              {formatTime(staff.updatedAt)}
            </p>
          </div>
        </div>

        <StaffDrawerActions onEmail={onEmail} onSms={onSms} onClose={onClose} />
      </div>

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center gap-x-3 gap-y-1.5"
      >
        <Badge
          variant={COMPLIANCE_TONE[tone]}
          shape="pill"
          badgeSize="md"
          className="gap-1.5"
        >
          <StatusIcon className="size-3.5" />
          {COMPLIANCE_STATUS_LABELS[compliance.complianceStatus]}
        </Badge>

        <span className="text-xs text-cf-ink-60">
          {compliance.canBeScheduled
            ? 'Cleared to be scheduled onto visits'
            : 'Not yet cleared for scheduling'}
        </span>
      </motion.div>
    </div>
  );
}