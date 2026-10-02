'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { StaffMember } from 'types';
import { formatDate, formatTime } from 'utils';

interface StaffDetailsTabProps {
  staff: StaffMember;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Label-left / value-right row, matching the reference layout —
// thin divider between rows, no leading icon.
function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-cf-border py-3 last:border-b-0">
      <span className="text-sm text-cf-ink-60">{label}</span>
      <span className="text-right text-sm font-semibold text-cf-ink">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div variants={item}>
      <Card className="border-cf-border">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-cf-ink">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export function StaffDetailsTab({ staff }: StaffDetailsTabProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* Contact Information */}
      <Section title="Contact Information">
        <InfoRow
          label="Email"
          value={
            <span className="inline-flex items-center gap-1.5">
              {staff.email}
              {!staff.emailVerified && (
                <span className="text-xs font-medium text-orange-600">(unverified)</span>
              )}
            </span>
          }
        />
        {staff.phone && <InfoRow label="Phone" value={staff.phone} />}
      </Section>

      {/* Employment Information */}
      <Section title="Employment Information">
        <InfoRow
          label="Employment Status"
          value={<span className="capitalize">{staff.status?.toLowerCase()}</span>}
        />
        <InfoRow label="Join Date" value={formatDate(staff.joinDate)} />
        {staff.invitedAt && (
          <InfoRow label="Invited On" value={formatDate(staff.invitedAt)} />
        )}
        {staff.acceptedAt && (
          <InfoRow label="Accepted On" value={formatDate(staff.acceptedAt)} />
        )}
        {staff.invitedBy && <InfoRow label="Invited By" value={staff.invitedBy} />}
      </Section>

      {/* Account Status */}
      <Section title="Account Status">
        <InfoRow
          label="User Status"
          value={<span className="capitalize">{staff.userStatus?.toLowerCase()}</span>}
        />
        <InfoRow
          label="Email Verification"
          value={staff.emailVerified ? 'Verified' : 'Pending Verification'}
        />
        <InfoRow label="Last Updated" value={formatTime(staff.updatedAt)} />
      </Section>
    </motion.div>
  );
}