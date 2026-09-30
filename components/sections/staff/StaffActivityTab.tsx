'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { StaffMember } from 'types';
import { formatTime } from 'utils';
import {
  buildStaffActivities,
  activityToneClasses,
  staffActivityContainerVariants,
  staffActivityItemVariants,
} from 'utils';

interface StaffActivityTabProps {
  staff: StaffMember;
}

export function StaffActivityTab({ staff }: StaffActivityTabProps) {
  const activities = buildStaffActivities(staff);

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
          variants={staffActivityContainerVariants}
          initial="hidden"
          animate="show"
          className="relative space-y-1"
        >
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-cf-border" aria-hidden />
          {activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={idx}
                variants={staffActivityItemVariants}
                className="relative flex gap-4 rounded-lg p-3 transition-colors duration-200 hover:bg-cf-surface-muted"
              >
                <div
                  className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${activityToneClasses[activity.tone]}`}
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