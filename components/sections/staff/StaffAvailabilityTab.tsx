'use client';

import { CalendarClock, Languages, MapPin, Sparkles } from 'lucide-react';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  EmptyState,
  StaffFormReviewGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import type { MockStaffProfile } from 'lib';
import {
  
  formatStaffHours,
  getStaffSlotHours,
  getStaffWeeklyHours,
  sortStaffAvailability,
} from 'utils';
import { DAY_LABELS } from '@/types';

interface StaffAvailabilityTabProps {
  profile: MockStaffProfile;
}

export function StaffAvailabilityTab({ profile }: StaffAvailabilityTabProps) {
  const { languages, skills, workAreaPostcode, availability, contractedHoursPerWeek } =
    profile.data;

  const slots = sortStaffAvailability(availability);
  const weeklyHours = getStaffWeeklyHours(slots);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Weekly Hours</CardDescription>
            <CardTitle className="text-2xl font-bold text-cf-ink">
              {weeklyHours} hrs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="softMuted" shape="pill" badgeSize="sm">
              Contracted {formatStaffHours(contractedHoursPerWeek)}
            </Badge>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Days Available</CardDescription>
            <CardTitle className="text-2xl font-bold text-cf-ink">
              {slots.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="softMuted" shape="pill" badgeSize="sm">
              {new Set(slots.map((slot) => slot.day)).size} days a week
            </Badge>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Work Area</CardDescription>
            <CardTitle className="flex items-center gap-1.5 text-xl font-bold text-cf-ink">
              <MapPin className="size-4 text-cf-ink-40" />
              {workAreaPostcode || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="softMuted" shape="pill" badgeSize="sm">
              Base postcode
            </Badge>
          </CardContent>
        </Card>
      </div>

      {availability.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={`${slot.day}-${slot.startTime}`}>
                <TableCell className="font-semibold text-cf-ink">
                  {DAY_LABELS[slot.day]}
                </TableCell>
                <TableCell>{slot.startTime}</TableCell>
                <TableCell>{slot.endTime}</TableCell>
                <TableCell>{getStaffSlotHours(slot)} hrs</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={<CalendarClock />}
          title="No availability recorded"
          description="Add the days and hours this staff member is able to work so they can be matched to visits."
        />
      )}

      <StaffFormReviewGroup title="Languages">
        {languages.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 py-2">
            {languages.map((language) => (
              <Chip key={language} tone="info">
                <Languages className="size-3" />
                {language}
              </Chip>
            ))}
          </div>
        ) : (
          <div className="py-2 text-sm text-muted-foreground">
            No languages recorded.
          </div>
        )}
      </StaffFormReviewGroup>

      <StaffFormReviewGroup title="Skills">
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 py-2">
            {skills.map((skill) => (
              <Chip key={skill} tone="success">
                <Sparkles className="size-3" />
                {skill}
              </Chip>
            ))}
          </div>
        ) : (
          <div className="py-2 text-sm text-muted-foreground">
            No skills recorded.
          </div>
        )}
      </StaffFormReviewGroup>
    </div>
  );
}