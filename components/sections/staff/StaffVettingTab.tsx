'use client';

import { Mail, Phone, UserCheck } from 'lucide-react';
import {
  Badge,
  Button,
  EmptyState,
  StaffComplianceSummary,
  StaffReviewCompliance,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import { REFEREE_RELATIONSHIP_LABELS } from 'types';

interface StaffVettingTabProps {
  profile: MockStaffProfile;
}

export function StaffVettingTab({ profile }: StaffVettingTabProps) {
  const { data } = profile;
  const { referees } = data;

  return (
    <div className="space-y-6">
      <StaffComplianceSummary compliance={profile.compliance} />

      <StaffReviewCompliance data={data} compliance={profile.compliance} />

      {referees.length === 0 ? (
        <EmptyState
          icon={<UserCheck />}
          title="No referees recorded"
          description="References are collected during vetting so the agency can confirm previous care history."
        />
      ) : (
        <div className="space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referee</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referees.map((referee) => (
                <TableRow key={referee.email || referee.name}>
                  <TableCell>
                    <p className="font-semibold text-cf-ink">{referee.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {referee.role}
                      {referee.organisation ? ` · ${referee.organisation}` : ''}
                    </p>
                  </TableCell>
                  <TableCell>
                    {REFEREE_RELATIONSHIP_LABELS[referee.relationship]}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {referee.email ? (
                        <Button
                          variant="ghost"
                          size="xs"
                          nativeButton={false}
                          render={<a href={`mailto:${referee.email}`} />}
                        >
                          <Mail className="size-3" />
                          Email
                        </Button>
                      ) : null}
                      {referee.phone ? (
                        <Button
                          variant="ghost"
                          size="xs"
                          nativeButton={false}
                          render={<a href={`tel:${referee.phone}`} />}
                        >
                          <Phone className="size-3" />
                          Call
                        </Button>
                      ) : null}
                      {!referee.email && !referee.phone ? (
                        <span className="text-xs text-muted-foreground">
                          Not provided
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={referee.referenceReceived ? 'softSuccess' : 'softWarning'}
                      shape="pill"
                      badgeSize="sm"
                    >
                      {referee.referenceReceived ? 'Received' : 'Outstanding'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}