'use client';

import { Award, GraduationCap } from 'lucide-react';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
  StaffFormReviewGroup,
  StaffFormReviewItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import { TRAINING_STATUS_LABELS } from 'types';
import {
  formatStaffDate,
  getStaffTrainingProgress,
  getStaffTrainingTone,
} from 'utils';

interface StaffTrainingTabProps {
  profile: MockStaffProfile;
}

const TONE_BADGE = {
  success: 'softSuccess',
  warning: 'softWarning',
  danger: 'softDanger',
  neutral: 'softMuted',
} as const;

export function StaffTrainingTab({ profile }: StaffTrainingTabProps) {
  const { qualifications, mandatoryTraining } = profile.data;
  const progress = getStaffTrainingProgress(mandatoryTraining);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mandatory Training</CardTitle>
          <CardDescription>
            Every mandatory module must be completed before this staff member
            can be scheduled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Progress value={progress.percent} className="flex-1">
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>

              <ProgressValue>
                {(formattedValue) => `${formattedValue}%`}
              </ProgressValue>
            </Progress>
            <Badge
              variant={TONE_BADGE[progress.expired > 0 ? 'danger' : 'success']}
              shape="pill"
              badgeSize="md"
            >
              {progress.completed} of {progress.total} completed
            </Badge>
          </div>

          {progress.expired > 0 ? (
            <Badge variant="softDanger" shape="pill" badgeSize="sm">
              {progress.expired} expired — book a refresher
            </Badge>
          ) : null}
        </CardContent>
      </Card>

      {qualifications.length > 0 ? (
        <StaffFormReviewGroup title="Qualifications">
          {qualifications.map((qualification) => (
            <StaffFormReviewItem
              key={`${qualification.name}-${qualification.awardedDate}`}
              label={qualification.name}
              value={`Awarded ${formatStaffDate(qualification.awardedDate)}`}
            />
          ))}
        </StaffFormReviewGroup>
      ) : (
        <EmptyState
          icon={<Award />}
          title="No qualifications recorded"
          description="Add care certificates or NVQs so the agency can verify the care experience of this staff member."
        />
      )}

      {mandatoryTraining.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mandatoryTraining.map((record) => (
              <TableRow key={`${record.module}-${record.status}`}>
                <TableCell className="font-semibold text-cf-ink">
                  {record.module}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={TONE_BADGE[getStaffTrainingTone(record)]}
                    shape="pill"
                    badgeSize="sm"
                  >
                    {TRAINING_STATUS_LABELS[record.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatStaffDate(record.completedDate)}</TableCell>
                <TableCell>{formatStaffDate(record.expiryDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={<GraduationCap />}
          title="No training records"
          description="Record the mandatory courses this staff member has completed, booked or still needs."
        />
      )}
    </div>
  );
}