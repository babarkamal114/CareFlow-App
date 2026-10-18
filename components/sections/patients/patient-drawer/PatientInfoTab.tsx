'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { Patient } from "types";

interface PatientInfoTabProps {
  patient: {
    id: string;
    name: string;
    preferredName?: string;
    dateOfBirth?: string;
    nhsNumber?: string;
    address: string;
    email: string;
    phone: string;
    carer: string;
    status: 'active' | 'on-hold' | 'new' | 'discharged';
    nextVisit: string;
    gpName?: string;
    gpPhone?: string;
    gpAddress?: string;
    nextOfKinName?: string;
    nextOfKinPhone?: string;
    nextOfKinRelationship?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    emergencyRelationship?: string;
    risk: 'low' | 'medium' | 'high';
    consentDataSharing?: boolean;
    consentFamilySharing?: boolean;
    consentPhotoEvidence?: boolean;
    consentNotes?: string;
  };
}

// Compact per-domain risk strip. Mirrors the domains covered in the full
// Risk Assessments tab (falls, pressure ulcer, nutrition, medication,
// safeguarding) so the profile gives an at-a-glance summary without
// duplicating the full assessment detail.
const RISK_DOMAIN_LABELS: Record<string, string> = {
  falls: 'Falls',
  'pressure-ulcer': 'Skin Integrity',
  nutrition: 'Nutrition',
  medication: 'Medication',
  safeguarding: 'Safeguarding',
};

function riskDomainVariant(level: 'high' | 'medium' | 'low') {
  return level === 'high' ? 'pastel-danger' : level === 'medium' ? 'pastel-warning' : 'pastel-success';
}

export function PatientInfoTab({ patient }: PatientInfoTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Full Name</span>
            <span className="text-cf-ink font-medium">{patient.name}</span>
          </div>
          {patient.preferredName && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Preferred Name</span>
              <span className="text-cf-ink font-medium">{patient.preferredName}</span>
            </div>
          )}
          {patient.dateOfBirth && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Date of Birth</span>
              <span className="text-cf-ink font-medium">
                {new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}
              </span>
            </div>
          )}
          {patient.nhsNumber && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">NHS Number</span>
              <span className="text-cf-ink font-medium">{patient.nhsNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Address</span>
            <span className="text-cf-ink font-medium">{patient.address}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Email</span>
            <span className="text-cf-ink font-medium">{patient.email}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Phone</span>
            <span className="text-cf-ink font-medium">{patient.phone}</span>
          </div>
        </CardContent>
      </Card>

      {(patient.gpName || patient.gpPhone || patient.gpAddress) && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">GP Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.gpName && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">GP Name</span>
                <span className="text-cf-ink font-medium">{patient.gpName}</span>
              </div>
            )}
            {patient.gpPhone && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">GP Phone</span>
                <span className="text-cf-ink font-medium">{patient.gpPhone}</span>
              </div>
            )}
            {patient.gpAddress && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-cf-ink-60">GP Address</span>
                <span className="text-cf-ink font-medium">{patient.gpAddress}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(patient.nextOfKinName || patient.emergencyContact) && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Next of Kin & Emergency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.nextOfKinName && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cf-ink-60">Next of Kin</span>
                  <span className="text-cf-ink font-medium">{patient.nextOfKinName}</span>
                </div>
                {patient.nextOfKinRelationship && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-cf-ink-60">Relationship</span>
                    <span className="text-cf-ink font-medium">{patient.nextOfKinRelationship}</span>
                  </div>
                )}
                {patient.nextOfKinPhone && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-cf-ink-60">Phone</span>
                    <span className="text-cf-ink font-medium">{patient.nextOfKinPhone}</span>
                  </div>
                )}
              </>
            )}
            {patient.emergencyContact && (
              <>
                <div className="border-t border-cf-border pt-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-cf-ink-60">Emergency Contact</span>
                    <span className="text-cf-ink font-medium">{patient.emergencyContact}</span>
                  </div>
                  {patient.emergencyRelationship && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cf-ink-60">Relationship</span>
                      <span className="text-cf-ink font-medium">{patient.emergencyRelationship}</span>
                    </div>
                  )}
                  {patient.emergencyPhone && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-cf-ink-60">Phone</span>
                      <span className="text-cf-ink font-medium">{patient.emergencyPhone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Care Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Primary Carer</span>
            <span className="text-cf-ink font-medium">{patient.carer}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Risk Level</span>
            <Badge
              variant={
                patient.risk === 'high'
                  ? 'pastel-danger'
                  : patient.risk === 'medium'
                  ? 'pastel-warning'
                  : 'pastel-success'
              }
              className="text-xs"
              shape="pill"
            >
              {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Status</span>
            <Badge
              variant={
                patient.status === 'active'
                  ? 'pastel-success'
                  : patient.status === 'on-hold'
                  ? 'pastel-warning'
                  : 'pastel-info'
              }
              className="text-xs"
              shape="pill"
            >
              {patient.status === 'active' ? 'Active' : patient.status === 'on-hold' ? 'On Hold' : 'New'}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Next Visit</span>
            <span className="text-cf-ink font-medium">{patient.nextVisit}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Risk Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(RISK_DOMAIN_LABELS).map(([key, label]) => (
              <Badge
                key={key}
                variant={riskDomainVariant(patient.risk)}
                className="text-xs"
                shape="pill"
              >
                {label}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-cf-ink-40 mt-2">
            See the Risk tab for full scoring, tools used, and interventions per domain.
          </p>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Consent Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Share data with care professionals</span>
            {patient.consentDataSharing ? (
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
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Share updates with family</span>
            {patient.consentFamilySharing ? (
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
          <div className="flex justify-between items-center text-sm">
            <span className="text-cf-ink-60">Photo evidence</span>
            {patient.consentPhotoEvidence ? (
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
          {patient.consentNotes && (
            <div className="pt-2 border-t border-cf-border">
              <p className="text-xs text-cf-ink-60">{patient.consentNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}