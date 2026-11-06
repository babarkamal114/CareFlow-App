// components/sections/patients/patient-drawer/PatientDrawer.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { ScrollArea } from "@/components/ui";
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
import { Button } from "@/components/ui";
import { ChevronDown } from 'lucide-react';
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


interface Patient {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  address: string;
  avatar?: string;
  initials: string;
  age: number;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'on-hold' | 'new' | 'discharged';
  carer: string;
  nextVisit: string;
  email: string;
  phone: string;
  gpName?: string;
  gpPhone?: string;
  gpAddress?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  conditions?: Array<{ name: string; diagnosedDate: string; status: 'active' | 'managed' | 'resolved' }>;
  allergies?: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string }>;
  hospitalisations?: Array<{ date: string; reason: string; duration: string; outcome: string }>;
  preferredLanguage?: string;
  hearingImpairment?: string;
  visionImpairment?: string;
  mentalCapacity?: string;
  hearingAids?: boolean;
  glasses?: boolean;
  pictureBoard?: boolean;
  interpreter?: boolean;
  communicationNotes?: string;
  poaName?: string;
  poaRelationship?: string;
  poaPhone?: string;
  consentDataSharing?: boolean;
  consentFamilySharing?: boolean;
  consentPhotoEvidence?: boolean;
  consentNotes?: string;
  wakeTime?: string;
  bedTime?: string;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  bathPreference?: string;
  teaPreference?: string;
  dietaryPreferences?: string;
  culturalReligious?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  dailyRoutine?: string;
  personalHistory?: string;
  familyBackground?: string;
  whatMakesMeSmile?: string;
  whatUpsetsMe?: string;
  whatMattersToMe?: string;
  lifeHistory?: string;
  importantPeople?: string;
}

interface PatientDrawerProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPatient?: () => void;
  onUpdateMeds?: () => void;
  onDischarge?: (patientId: string, payload: DischargePayload) => Promise<void> | void;
}

const MAIN_TABS = [
  { value: 'info', label: 'Info' },
  { value: 'medical', label: 'Medical' },
  { value: 'communication', label: 'Communication' },
  { value: 'preferences', label: 'Preferences' },
];

const MORE_TABS = [
  { value: 'activity', label: 'Activity' },
  { value: 'medications', label: 'Medications' },
  { value: 'documents', label: 'Documents' },
  { value: 'clinical', label: 'Clinical Notes' },
  { value: 'risk', label: 'Risk' },
];

export function PatientDrawer({ patient, open, onOpenChange, onEditPatient, onUpdateMeds, onDischarge }: PatientDrawerProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);

  if (!patient) return null;

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
                  {patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)} Risk
                </Badge>
                {patient.status === 'discharged' && (
                  <Badge variant="softMuted" className="text-xs" shape="pill">
                    Discharged
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
                {MAIN_TABS.map((tab) => (
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
                  {MORE_TABS.map((tab) => (
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

            <TabsContent value="info" className="p-6">
              <PatientInfoTab patient={patient} />
            </TabsContent>

            <TabsContent value="medical" className="p-6">
              <PatientMedicalHistoryTab
                conditions={patient.conditions || []}
                allergies={patient.allergies || []}
                hospitalisations={patient.hospitalisations || []}
              />
            </TabsContent>

            <TabsContent value="communication" className="p-6">
              <PatientCommunicationTab
                preferredLanguage={patient.preferredLanguage}
                hearingImpairment={patient.hearingImpairment}
                visionImpairment={patient.visionImpairment}
                mentalCapacity={patient.mentalCapacity}
                hearingAids={patient.hearingAids}
                glasses={patient.glasses}
                pictureBoard={patient.pictureBoard}
                interpreter={patient.interpreter}
                communicationNotes={patient.communicationNotes}
                poaName={patient.poaName}
                poaRelationship={patient.poaRelationship}
                poaPhone={patient.poaPhone}
              />
            </TabsContent>

            <TabsContent value="preferences" className="p-6">
              <PatientPreferencesTab
                wakeTime={patient.wakeTime}
                bedTime={patient.bedTime}
                breakfastTime={patient.breakfastTime}
                lunchTime={patient.lunchTime}
                dinnerTime={patient.dinnerTime}
                bathPreference={patient.bathPreference}
                teaPreference={patient.teaPreference}
                dietaryPreferences={patient.dietaryPreferences}
                culturalReligious={patient.culturalReligious}
                likes={patient.likes}
                dislikes={patient.dislikes}
                hobbies={patient.hobbies}
                dailyRoutine={patient.dailyRoutine}
              />
            </TabsContent>

            <TabsContent value="activity" className="p-6">
              <PatientActivityTab />
            </TabsContent>

            <TabsContent value="medications" className="p-6">
              <PatientMedicationsTab />
            </TabsContent>

            <TabsContent value="documents" className="p-6">
              <PatientDocumentsTab />
            </TabsContent>

            <TabsContent value="clinical" className="p-6">
              <PatientClinicalNotesTab />
            </TabsContent>

            <TabsContent value="risk" className="p-6">
              <PatientRiskAssessmentsTab />
            </TabsContent>
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