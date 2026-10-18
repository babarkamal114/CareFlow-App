'use client';

import { motion, type Variants } from 'framer-motion';
import { UserPlus2, Mail, CheckCircle2, RotateCw, Trash2, Clock, LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { StaffMember } from 'types';
import { formatTime } from 'utils';

interface StaffActivityTabProps {
  staff: StaffMember;
}

type Tone = 'default' | 'success' | 'info' | 'danger';

interface Activity {
  action: string;
  timestamp: Date | string | null | undefined;
  icon: LucideIcon;
  tone: Tone;
}

const toneClasses: Record<Tone, string> = {
  default: 'bg-cf-surface-muted text-cf-ink-60',
  success: 'bg-emerald-50 text-emerald-600',
  info: 'bg-cf-blue-50 text-[#2258A6]',
  danger: 'bg-red-50 text-red-600',
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function StaffActivityTab({ staff }: StaffActivityTabProps) {
  const activities: Activity[] = [
    { action: 'Account Created', timestamp: staff.createdAt, icon: UserPlus2, tone: 'default' },
  ];

  if (staff.invitedAt) {
    activities.push({
      action: 'Invitation Sent',
      timestamp: staff.invitedAt,
      icon: Mail,
      tone: 'info',
    });
  }

  if (staff.acceptedAt) {
    activities.push({
      action: 'Invitation Accepted',
      timestamp: staff.acceptedAt,
      icon: CheckCircle2,
      tone: 'success',
    });
  }

  activities.push({
    action: 'Last Updated',
    timestamp: staff.updatedAt,
    icon: RotateCw,
    tone: 'default',
  });

  if (staff.deletedAt) {
    activities.push({
      action: 'Account Deleted',
      timestamp: staff.deletedAt,
      icon: Trash2,
      tone: 'danger',
    });
  }

  return (
    <Card className="border-cf-border">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-cf-ink">
          <Clock className="h-4 w-4 text-cf-ink-60" />
          Activity Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative space-y-1"
        >
          {/* Connecting line running behind the icon chips */}
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-cf-border" aria-hidden />

          {activities.map((activity, idx) => {
            const Icon = activity.icon;

            return (
              <motion.div
                key={idx}
                variants={item}
                className="relative flex gap-4 rounded-lg p-3 transition-colors duration-200 hover:bg-cf-surface-muted"
              >
                <div
                  className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${toneClasses[activity.tone]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <p className="text-sm font-medium text-cf-ink">{activity.action}</p>
                  <p className="mt-0.5 text-xs text-cf-ink-60">{formatTime(activity.timestamp)}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}