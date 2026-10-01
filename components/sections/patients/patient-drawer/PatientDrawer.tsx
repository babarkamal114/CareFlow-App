'use client';

import type { ReactNode } from 'react';
import { Button , Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, Avatar, AvatarFallback, AvatarImage, Badge  } from "@/components/ui";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { ChevronDown } from 'lucide-react';
import { usePatientDrawer } from 'hooks';
import {
  PATIENT_COMMUNICATION_KEYS,
  PATIENT_DRAWER_MAIN_TABS,
  PATIENT_DRAWER_MORE_TABS,
  PATIENT_DRAWER_SKELETON_TAB_IDS,
  PATIENT_DRAWER_TABS,
  PATIENT_PREFERENCES_KEYS,
  getPatientStatusBadge,
  getRiskLevelBadge,
  pickPatientFields,
  type PatientDrawerPatient,
  type PatientDrawerTabId,
} from 'utils';
import { PatientDrawerFooter } from '../PatientDrawerFooter';
import { PatientDischargeModal, type DischargePayload } from './PatientDischargeModal';
import { PatientInfoTab } from './PatientInfoTab';
import { PatientMedicalHistoryTab } from './PatientMedicalHistoryTab';
import { PatientCommunicationTab } from './PatientCommunicationTab';
import { PatientPreferencesTab } from './PatientPreferenceTab';
import { PatientActivityTab } from './PatientActivitTab';
import { PatientMedicationsTab } from './PatientMedicationTab';
import { PatientDocumentsTab } from './PatientDocumentsTab';
import { PatientClinicalNotesTab } from './PatientClinicalNotesTab';
import { PatientRiskAssessmentsTab } from './PatientAssessmentTab';

interface PatientDrawerProps {
  patient: PatientDrawerPatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPatient?: () => void;
  onUpdateMeds?: () => void;
  onDischarge?: (patientId: string, payload: DischargePayload) => Promise<void> | void;
  isLoading?: boolean;
}

/** Which component each tab shows. JSX can't live in utils, so this map lives here. */
const TAB_RENDERERS: Record<PatientDrawerTabId, (patient: PatientDrawerPatient) => ReactNode> = {
  info: (patient) => <PatientInfoTab patient={patient} />,
  medical: (patient) => (
    <PatientMedicalHistoryTab
      conditions={patient.conditions || []}
      allergies={patient.allergies || []}
      hospitalisations={patient.hospitalisations || []}
    />
  ),
  communication: (patient) => (
    <PatientCommunicationTab {...pickPatientFields(patient, PATIENT_COMMUNICATION_KEYS)} />
  ),
  preferences: (patient) => (
    <PatientPreferencesTab {...pickPatientFields(patient, PATIENT_PREFERENCES_KEYS)} />
  ),
  activity: (patient) => <PatientActivityTab patientId={patient.id} />,
  medications: (patient) => <PatientMedicationsTab patientId={patient.id} />,
  documents: (patient) => <PatientDocumentsTab patientId={patient.id} />,
  clinical: () => <PatientClinicalNotesTab />,
  risk: () => <PatientRiskAssessmentsTab />,
};

function TabBodySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-cf-border p-4 space-y-3">
          <div className="h-4 w-32 rounded bg-cf-ink-40/20 animate-pulse" />
          <div className="h-3 w-full rounded bg-cf-ink-40/20 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-cf-ink-40/20 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function PatientDrawer({
  patient,
  open,
  onOpenChange,
  onEditPatient,
  onUpdateMeds,
  onDischarge,
  isLoading = false,
}: PatientDrawerProps) {
  const { activeTab, setActiveTab, dischargeModalOpen, setDischargeModalOpen } =
    usePatientDrawer(open, patient?.id);

  if (!patient) return null;

  const risk = getRiskLevelBadge(patient.risk);
  const status = getPatientStatusBadge(patient.status);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="h-full max-h-screen flex flex-col">
        <DrawerHeader className="border-b border-cf-border pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 border border-cf-border">
              {patient.avatar && <AvatarImage src={patient.avatar} alt={patient.name} />}
              <AvatarFallback className="bg-cf-primary/10 text-cf-primary font-semibold">
                {patient.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold text-cf-ink">
                {patient.name}
              </DrawerTitle>
              <p className="text-xs text-cf-ink-60 mt-1">ID: {patient.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="pastel-info" className="text-xs" shape="pill">
                  Age: {patient.age}
                </Badge>
                <Badge variant={risk.variant} className="text-xs" shape="pill">
                  {risk.label} Risk
                </Badge>
                {patient.status === 'discharged' && (
                  <Badge variant={status.variant} className="text-xs" shape="pill">
                    {status.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="flex items-center justify-between border-b border-cf-border px-6">
              <TabsList className="w-auto justify-start rounded-none bg-transparent">
                {PATIENT_DRAWER_MAIN_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-cf-primary rounded-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                    More
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {PATIENT_DRAWER_MORE_TABS.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className="cursor-pointer"
                    >
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {PATIENT_DRAWER_TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-6">
                {isLoading && PATIENT_DRAWER_SKELETON_TAB_IDS.has(tab.value) ? (
                  <TabBodySkeleton />
                ) : (
                  TAB_RENDERERS[tab.value](patient)
                )}
              </TabsContent>
            ))}
          </Tabs>
        </ScrollArea>

        <DrawerFooter>
          <PatientDrawerFooter
            onEdit={onEditPatient}
            onMedication={onUpdateMeds}
            onDischarge={patient.status !== 'discharged' ? () => setDischargeModalOpen(true) : undefined}
          />
        </DrawerFooter>
      </DrawerContent>

      <PatientDischargeModal
        open={dischargeModalOpen}
        onOpenChange={setDischargeModalOpen}
        patientName={patient.name}
        gpName={patient.gpName}
        nextOfKinName={patient.nextOfKinName}
        emergencyContact={patient.emergencyContact}
        onConfirm={async (payload) => {
          await onDischarge?.(patient.id, payload);
          onOpenChange(false);
        }}
      />
    </Drawer>
  );
}