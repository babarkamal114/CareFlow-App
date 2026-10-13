'use client';

import type { ReactNode } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  PatientDrawerHeader,
  PatientDrawerSkeleton,
  PatientDrawerTabList,
  ScrollArea,
  Tabs,
  TabsContent,
} from "@/components/ui";
import { usePatientDrawer } from 'hooks';
import {
  PATIENT_COMMUNICATION_KEYS,
  PATIENT_DRAWER_MAIN_TABS,
  PATIENT_DRAWER_MORE_TABS,
  PATIENT_DRAWER_SKELETON_TAB_IDS,
  PATIENT_DRAWER_TABS,
  PATIENT_PREFERENCES_KEYS,
  pickPatientFields,
} from 'utils';
import type { DischargePayload, Patient, PatientDrawerTabId, PatientMedication } from 'types';
import { PatientDrawerFooter } from '../PatientDrawerFooter';
import { PatientDischargeModal } from './PatientDischargeModal';
import { PatientInfoTab } from './PatientInfoTab';
import { PatientMedicalHistoryTab } from './PatientMedicalHistoryTab';
import { PatientCommunicationTab } from './PatientCommunicationTab';
import { PatientPreferencesTab } from './PatientPreferenceTab';
import { PatientActivityTab } from './PatientActivityTab';
import { PatientMedicationsTab } from './PatientMedicationTab';
import { PatientDocumentsTab } from './PatientDocumentsTab';
import { PatientClinicalNotesTab } from './PatientClinicalNotesTab';
import { PatientRiskAssessmentsTab } from './PatientAssessmentTab';

interface PatientDrawerProps {
  patient: Patient | null;
  /** Current medication list for the patient (owned by the page, shared with the edit modal). */
  medications: PatientMedication[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPatient?: (() => void) | undefined;
  onUpdateMeds?: (() => void) | undefined;
  onDischarge?: ((patientId: string, payload: DischargePayload) => Promise<void> | void) | undefined;
  isLoading?: boolean;
}

/** Which component each tab shows. JSX can't live in utils, so this map lives here. */
const TAB_RENDERERS: Record<
  PatientDrawerTabId,
  (patient: Patient, medications: PatientMedication[]) => ReactNode
> = {
  info: (patient) => <PatientInfoTab patient={patient} />,
  medical: (patient) => (
    <PatientMedicalHistoryTab
      conditions={patient.conditions ?? []}
      allergies={patient.allergies ?? []}
      hospitalisations={patient.hospitalisations ?? []}
    />
  ),
  communication: (patient) => (
    <PatientCommunicationTab {...pickPatientFields(patient, PATIENT_COMMUNICATION_KEYS)} />
  ),
  preferences: (patient) => (
    <PatientPreferencesTab {...pickPatientFields(patient, PATIENT_PREFERENCES_KEYS)} />
  ),
  activity: (patient) => <PatientActivityTab patientId={patient.id} />,
  medications: (_patient, medications) => <PatientMedicationsTab medications={medications} />,
  documents: (patient) => <PatientDocumentsTab patientId={patient.id} />,
  clinical: (patient) => <PatientClinicalNotesTab patientId={patient.id} />,
  risk: (patient) => <PatientRiskAssessmentsTab patientId={patient.id} />,
};

export function PatientDrawer({
  patient,
  medications,
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="flex h-full max-h-screen flex-col">
        <PatientDrawerHeader patient={patient} />

        <ScrollArea className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full w-full">
            <PatientDrawerTabList
              mainTabs={PATIENT_DRAWER_MAIN_TABS}
              moreTabs={PATIENT_DRAWER_MORE_TABS}
              activeTab={activeTab as PatientDrawerTabId}
              onSelectTab={setActiveTab}
            />

            {PATIENT_DRAWER_TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="p-6">
                {isLoading && PATIENT_DRAWER_SKELETON_TAB_IDS.has(tab.value) ? (
                  <PatientDrawerSkeleton />
                ) : (
                  TAB_RENDERERS[tab.value](patient, medications)
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