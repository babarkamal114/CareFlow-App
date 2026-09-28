'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import {
  CONSENT_ITEMS,
  RISK_DOMAIN_LABELS,
  getPatientStatusBadge,
  getRiskLevelBadge,
  hasGpDetails,
  type PatientInfoData,
} from 'utils';

interface PatientInfoTabProps {
  patient: PatientInfoData;
}

function InfoRow({ label, value }: { label: string; value?: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-cf-ink-60">{label}</span>
      <span className="text-cf-ink font-medium">{value}</span>
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
        <InfoRow label="Full Name" value={patient.name} />
        <InfoRow label="Preferred Name" value={patient.preferredName} />
        <InfoRow
          label="Date of Birth"
          value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-GB') : undefined}
        />
        <InfoRow label="NHS Number" value={patient.nhsNumber} />
        <InfoRow label="Address" value={patient.address} />
        <InfoRow label="Email" value={patient.email} />
        <InfoRow label="Phone" value={patient.phone} />
      </InfoCard>

      {hasGpDetails(patient) && (
        <InfoCard title="GP Details">
          <InfoRow label="GP Name" value={patient.gpName} />
          <InfoRow label="GP Phone" value={patient.gpPhone} />
          <InfoRow label="GP Address" value={patient.gpAddress} />
        </InfoCard>
      )}

      {(hasKin || hasEmergency) && (
        <InfoCard title="Next of Kin & Emergency">
          {hasKin && (
            <>
              <InfoRow label="Next of Kin" value={patient.nextOfKinName} />
              <InfoRow label="Relationship" value={patient.nextOfKinRelationship} />
              <InfoRow label="Phone" value={patient.nextOfKinPhone} />
            </>
          )}
          {hasEmergency && (
            <div className={`space-y-3 ${hasKin ? 'border-t border-cf-border pt-3' : ''}`}>
              <InfoRow label="Emergency Contact" value={patient.emergencyContact} />
              <InfoRow label="Relationship" value={patient.emergencyRelationship} />
              <InfoRow label="Phone" value={patient.emergencyPhone} />
            </div>
          )}
        </InfoCard>
      )}

      <InfoCard title="Care Details">
        <InfoRow label="Primary Carer" value={patient.carer} />
        <div className="flex justify-between items-center text-sm">
          <span className="text-cf-ink-60">Risk Level</span>
          <Badge variant={risk.variant} className="text-xs" shape="pill">{risk.label}</Badge>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-cf-ink-60">Status</span>
          <Badge variant={status.variant} className="text-xs" shape="pill">{status.label}</Badge>
        </div>
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