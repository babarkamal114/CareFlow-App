'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import {
  CONSENT_ITEMS,
  RISK_DOMAIN_LABELS,
  getEmergencyContactRows,
  getGpInfoRows,
  getNextOfKinRows,
  getPatientStatusBadge,
  getPersonalInfoRows,
  getRiskLevelBadge,
  hasGpDetails,
  type PatientInfoData,
  type PatientInfoRowData,
} from 'utils';

interface PatientInfoTabProps {
  patient: PatientInfoData;
}

function InfoRow({ label, value }: PatientInfoRowData) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-cf-ink-60">{label}</span>
      <span className="text-cf-ink font-medium">{value}</span>
    </div>
  );
}

function InfoRows({ rows }: { rows: PatientInfoRowData[] }) {
  return (
    <>
      {rows.map((row) => (
        <InfoRow key={row.label} {...row} />
      ))}
    </>
  );
}

function BadgeRow({ label, badge }: { label: string; badge: ReturnType<typeof getRiskLevelBadge> }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-cf-ink-60">{label}</span>
      <Badge variant={badge.variant} className="text-xs" shape="pill">{badge.label}</Badge>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-cf-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function ConsentRow({ label, consented }: { label: string; consented?: boolean | undefined }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-cf-ink-60">{label}</span>
      {consented ? (
        <Badge variant="pastel-success" className="text-xs gap-1" shape="pill">
          <ShieldCheck className="w-3 h-3" />
          Consented
        </Badge>
      ) : (
        <Badge variant="pastel-warning" className="text-xs gap-1" shape="pill">
          <ShieldQuestion className="w-3 h-3" />
          Not on file
        </Badge>
      )}
    </div>
  );
}

export function PatientInfoTab({ patient }: PatientInfoTabProps) {
  const risk = getRiskLevelBadge(patient.risk);
  const status = getPatientStatusBadge(patient.status);
  const hasKin = !!patient.nextOfKinName;
  const hasEmergency = !!patient.emergencyContact;

  return (
    <div className="space-y-4">
      <InfoCard title="Personal Information">
        <InfoRows rows={getPersonalInfoRows(patient)} />
      </InfoCard>

      {hasGpDetails(patient) && (
        <InfoCard title="GP Details">
          <InfoRows rows={getGpInfoRows(patient)} />
        </InfoCard>
      )}

      {(hasKin || hasEmergency) && (
        <InfoCard title="Next of Kin & Emergency">
          {hasKin && <InfoRows rows={getNextOfKinRows(patient)} />}
          {hasEmergency && (
            <div className={`space-y-3 ${hasKin ? 'border-t border-cf-border pt-3' : ''}`}>
              <InfoRows rows={getEmergencyContactRows(patient)} />
            </div>
          )}
        </InfoCard>
      )}

      <InfoCard title="Care Details">
        <InfoRow label="Primary Carer" value={patient.carer} />
        <BadgeRow label="Risk Level" badge={risk} />
        <BadgeRow label="Status" badge={status} />
        <InfoRow label="Next Visit" value={patient.nextVisit} />
      </InfoCard>

      <InfoCard title="Risk Profile">
        <div className="flex flex-wrap gap-2">
          {RISK_DOMAIN_LABELS.map((label) => (
            <Badge key={label} variant={risk.variant} className="text-xs" shape="pill">
              {label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-cf-ink-40">
          See the Risk tab for full scoring, tools used, and interventions per domain.
        </p>
      </InfoCard>

      <InfoCard title="Consent Records">
        {CONSENT_ITEMS.map((item) => (
          <ConsentRow key={item.key} label={item.label} consented={patient[item.key]} />
        ))}
        {patient.consentNotes && (
          <div className="pt-2 border-t border-cf-border">
            <p className="text-xs text-cf-ink-60">{patient.consentNotes}</p>
          </div>
        )}
      </InfoCard>
    </div>
  );
}