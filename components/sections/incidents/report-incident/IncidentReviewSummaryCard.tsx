'use client';

import { Badge, Card } from '@/components/ui';
import {
  formatIncidentDateTime,
  getBodyMarkings,
  getFlagsSummary,
  getIncidentTypeOptionLabel,
  getInjuriesSummary,
  getSeveritySummary,
} from 'utils';
import type { IncidentFormData } from 'types';

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-cf-ink-60">{label}</p>
      <p className="text-sm text-cf-ink whitespace-pre-wrap">{value || '-'}</p>
    </div>
  );
}

export function IncidentReviewSummaryCard({ form }: { form: IncidentFormData }) {
  const flags = getFlagsSummary(form);

  return (
    <Card className="space-y-4 border-cf-border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="softInfo" shape="pill" badgeSize="sm">
          {form.type ? getIncidentTypeOptionLabel(form.type) : 'Type not set'}
        </Badge>
        <Badge variant="softWarning" shape="pill" badgeSize="sm">
          {getSeveritySummary(form)}
        </Badge>
        {flags.map((flag) => (
          <Badge key={flag} variant="softDanger" shape="pill" badgeSize="sm">
            {flag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryRow label="Patient" value={`${form.patientName} (${form.patientId})`} />
        <SummaryRow
          label="Date & time"
          value={form.dateTime ? formatIncidentDateTime(new Date(form.dateTime)) : ''}
        />
        <SummaryRow label="Location" value={form.location} />
        <SummaryRow label="Reported by" value={form.reportedByName} />
        <SummaryRow label="Antecedent" value={form.antecedent} />
        <SummaryRow label="Description" value={form.description} />
        <SummaryRow label="Consequence" value={form.consequence} />
        <SummaryRow label="Injuries" value={getInjuriesSummary(form)} />
        <SummaryRow
          label="Body map"
          value={getBodyMarkings(form)
            .map((marking) => `${marking.bodyPart || 'Unspecified'} (${marking.markType})`)
            .join(', ')}
        />
        <SummaryRow label="Immediate actions" value={form.immediateActions} />
        <SummaryRow
          label="Care plan"
          value={
            form.carePlanFollowed === null
              ? ''
              : form.carePlanFollowed
                ? 'Followed as written'
                : `Deviated - ${form.carePlanDeviationReason || 'no reason given'}`
          }
        />
        <SummaryRow
          label="Emergency services"
          value={
            form.emergencyServicesCalled
              ? form.emergencyServicesDetails || 'Contacted'
              : 'Not called'
          }
        />
        <SummaryRow
          label="Contributing factors"
          value={form.contributingFactors.join(', ')}
        />
        <SummaryRow label="Follow up plan" value={form.followUpPlan} />
        <SummaryRow label="Evidence attached" value={`${form.evidence.length} item(s)`} />
      </div>
    </Card>
  );
}