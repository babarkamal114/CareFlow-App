'use client';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
  StaffFormReviewGroup,
  StaffFormReviewItem,
  StaffReviewPersonal,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import type { StaffMember } from 'types';
import {
  formatStaffDate,
  formatTime,
  getStaffProfileCompleteness,
} from 'utils';

interface StaffProfileTabProps {
  staff: StaffMember;
  profile: MockStaffProfile;
}

export function StaffProfileTab({ staff, profile }: StaffProfileTabProps) {
  const { data } = profile;
  const completeness = getStaffProfileCompleteness(data);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Record Completeness</CardTitle>
          <CardDescription>
            How much of the staff record has been filled in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Progress value={completeness} className="flex-1">
              <ProgressTrack trackSize="lg">
                <ProgressIndicator />
              </ProgressTrack>
              <ProgressValue>{completeness}%</ProgressValue>
            </Progress>
            <Badge
              variant={completeness === 100 ? 'softSuccess' : 'softWarning'}
              shape="pill"
              badgeSize="md"
            >
              {completeness === 100 ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
          {data.photoConsentForFamilyPortal ? (
            <Badge variant="softInfo" shape="pill" badgeSize="sm">
              Photo shared with the family portal
            </Badge>
          ) : null}
        </CardContent>
      </Card>

      <StaffReviewPersonal data={data} />

      <StaffFormReviewGroup title="Account & Record">
        <StaffFormReviewItem
          label="Account Status"
          value={<span className="capitalize">{staff.status?.toLowerCase()}</span>}
        />
        <StaffFormReviewItem
          label="User Status"
          value={<span className="capitalize">{staff.userStatus?.toLowerCase()}</span>}
        />
        <StaffFormReviewItem
          label="Email Verification"
          value={
            <Badge
              variant={staff.emailVerified ? 'softSuccess' : 'softWarning'}
              shape="pill"
              badgeSize="sm"
            >
              {staff.emailVerified ? 'Verified' : 'Pending verification'}
            </Badge>
          }
        />
        <StaffFormReviewItem label="Join Date" value={formatStaffDate(staff.joinDate)} />
        <StaffFormReviewItem label="Invited By" value={staff.invitedBy} />
        <StaffFormReviewItem label="Invited On" value={formatStaffDate(staff.invitedAt)} />
        <StaffFormReviewItem
          label="Accepted On"
          value={formatStaffDate(staff.acceptedAt)}
        />
        <StaffFormReviewItem label="Last Updated" value={formatTime(staff.updatedAt)} />
      </StaffFormReviewGroup>
    </div>
  );
}