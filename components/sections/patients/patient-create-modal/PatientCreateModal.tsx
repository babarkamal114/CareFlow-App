'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  ScrollArea
} from "@/components/ui"
import { CreatePatientModalProgress } from './PatientCreateModalProgress';
import { CreatePatientModalFooter } from './PatientCreateModalFooter';
import { AttachmentsStep } from './PatientCreateModalDocStep';
import { AssignCarersStep } from './PatientCreateModalAssignCarerStep';
import { MedicationsStep } from './PatientCreateModalMedStep';
import { LifeStoryStep } from './PatientCreateModalLifeStoryStep';
import { KeyContactsStep } from './PatientCreateModalKeyContactsStep';
import { PreferencesStep } from './PatientCreateModalPreferencesStep';
import { CommunicationStep } from './PatientCreateModalCommunicationStep';
import { MedicalHistoryStep } from './PatientCreateModalMedHistoryStep';
import { PatientInfoStep } from './PatientCreateModalInfoStep';


interface CreatePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreate?: (patient: any) => void;
}

export interface PatientFormData {
  // Personal Details
  name: string;
  preferredName: string;
  dateOfBirth: string;
  nhsNumber: string;
  email: string;
  phone: string;
  address: string;
  gpName: string;
  gpPhone: string;
  gpAddress: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  
  // Risk & Status
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'on-hold' | 'new';
  
  // Medical History
  conditions: Array<{ id: string; name: string; diagnosedDate: string; status: 'active' | 'managed' | 'resolved' }>;
  allergies: Array<{ id: string; name: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string }>;
  hospitalisations: Array<{ id: string; date: string; reason: string; duration: string; outcome: string }>;
  
  // Communication
  preferredLanguage: string;
  hearingImpairment: string;
  visionImpairment: string;
  mentalCapacity: string;
  hearingAids: boolean;
  glasses: boolean;
  pictureBoard: boolean;
  interpreter: boolean;
  communicationNotes: string;
  poaName: string;
  poaRelationship: string;
  poaPhone: string;

  // Consent Records
  consentDataSharing: boolean;
  consentFamilySharing: boolean;
  consentPhotoEvidence: boolean;
  consentNotes: string;

  // Preferences
  wakeTime: string;
  bedTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  bathPreference: string;
  teaPreference: string;
  dietaryPreferences: string;
  culturalReligious: string;
  likes: string;
  dislikes: string;
  hobbies: string;
  dailyRoutine: string;
  
  // Life Story
  personalHistory: string;
  familyBackground: string;
  whatMakesMeSmile: string;
  whatUpsetsMe: string;
  whatMattersToMe: string;
  lifeHistory: string;
  importantPeople: string;
  
  // Key Contacts
  contacts: Array<{
    id: string;
    type: 'gp' | 'district-nurse' | 'social-worker' | 'pharmacist' | 'family' | 'other';
    name: string;
    role: string;
    phone: string;
    email: string;
    relationship: string;
    isPrimary: boolean;
    isEmergency: boolean;
  }>;
  
  // Other
  selectedCarers: string[];
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    indication: string;
    route: string;
    prescriber: string;
    startDate: string;
    medicationType: 'regular' | 'prn' | 'controlled' | 'short-course' | 'variable-dose';
    instructions: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    docType?: string;
    file: File;
  }>;
}

const TOTAL_STEPS = 9;

const STEP_LABELS = [
  'Personal Details',
  'Medical History',
  'Communication',
  'Preferences',
  'Key Contacts',
  'Life Story',
  'Medications',
  'Assign Carers',
  'Documents',
];

export function CreatePatientModal({
  open,
  onOpenChange,
  onPatientCreate,
}: CreatePatientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    preferredName: '',
    dateOfBirth: '',
    nhsNumber: '',
    email: '',
    phone: '',
    address: '',
    gpName: '',
    gpPhone: '',
    gpAddress: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    risk: 'low',
    status: 'new',
    conditions: [],
    allergies: [],
    hospitalisations: [],
    preferredLanguage: '',
    hearingImpairment: 'none',
    visionImpairment: 'none',
    mentalCapacity: 'full',
    hearingAids: false,
    glasses: false,
    pictureBoard: false,
    interpreter: false,
    communicationNotes: '',
    poaName: '',
    poaRelationship: '',
    poaPhone: '',
    consentDataSharing: false,
    consentFamilySharing: false,
    consentPhotoEvidence: false,
    consentNotes: '',
    wakeTime: '',
    bedTime: '',
    breakfastTime: '',
    lunchTime: '',
    dinnerTime: '',
    bathPreference: '',
    teaPreference: '',
    dietaryPreferences: '',
    culturalReligious: '',
    likes: '',
    dislikes: '',
    hobbies: '',
    dailyRoutine: '',
    personalHistory: '',
    familyBackground: '',
    whatMakesMeSmile: '',
    whatUpsetsMe: '',
    whatMattersToMe: '',
    lifeHistory: '',
    importantPeople: '',
    contacts: [],
    selectedCarers: [],
    medications: [],
    attachments: [],
  });

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Patient name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (step === 5) {
      if (formData.contacts.length === 0) {
        newErrors.contacts = 'Add at least one key contact before continuing';
      }
    }

    if (step === 8) {
      if (formData.selectedCarers.length === 0) {
        newErrors.carers = 'Select at least one carer before continuing';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCreatePatient = () => {
    if (validateStep(currentStep)) {
      const patientId = Date.now().toString();
      const initials = formData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

      const newPatient = {
        id: patientId,
        name: formData.name,
        preferredName: formData.preferredName,
        dateOfBirth: formData.dateOfBirth,
        nhsNumber: formData.nhsNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
        risk: formData.risk,
        status: formData.status,
        initials,
        gpName: formData.gpName,
        gpPhone: formData.gpPhone,
        gpAddress: formData.gpAddress,
        nextOfKinName: formData.nextOfKinName,
        nextOfKinPhone: formData.nextOfKinPhone,
        nextOfKinRelationship: formData.nextOfKinRelationship,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelationship: formData.emergencyRelationship,
        conditions: formData.conditions,
        allergies: formData.allergies,
        hospitalisations: formData.hospitalisations,
        preferredLanguage: formData.preferredLanguage,
        hearingImpairment: formData.hearingImpairment,
        visionImpairment: formData.visionImpairment,
        mentalCapacity: formData.mentalCapacity,
        hearingAids: formData.hearingAids,
        glasses: formData.glasses,
        pictureBoard: formData.pictureBoard,
        interpreter: formData.interpreter,
        communicationNotes: formData.communicationNotes,
        poaName: formData.poaName,
        poaRelationship: formData.poaRelationship,
        poaPhone: formData.poaPhone,
        consentDataSharing: formData.consentDataSharing,
        consentFamilySharing: formData.consentFamilySharing,
        consentPhotoEvidence: formData.consentPhotoEvidence,
        consentNotes: formData.consentNotes,
        wakeTime: formData.wakeTime,
        bedTime: formData.bedTime,
        breakfastTime: formData.breakfastTime,
        lunchTime: formData.lunchTime,
        dinnerTime: formData.dinnerTime,
        bathPreference: formData.bathPreference,
        teaPreference: formData.teaPreference,
        dietaryPreferences: formData.dietaryPreferences,
        culturalReligious: formData.culturalReligious,
        likes: formData.likes,
        dislikes: formData.dislikes,
        hobbies: formData.hobbies,
        dailyRoutine: formData.dailyRoutine,
        personalHistory: formData.personalHistory,
        familyBackground: formData.familyBackground,
        whatMakesMeSmile: formData.whatMakesMeSmile,
        whatUpsetsMe: formData.whatUpsetsMe,
        whatMattersToMe: formData.whatMattersToMe,
        lifeHistory: formData.lifeHistory,
        importantPeople: formData.importantPeople,
        contacts: formData.contacts,
        carer: formData.selectedCarers[0] || '',
        nextVisit: 'TBD',
        medications: formData.medications,
        attachments: formData.attachments,
      };

      onPatientCreate?.(newPatient);

      setFormData({
        name: '',
        preferredName: '',
        dateOfBirth: '',
        nhsNumber: '',
        email: '',
        phone: '',
        address: '',
        gpName: '',
        gpPhone: '',
        gpAddress: '',
        nextOfKinName: '',
        nextOfKinPhone: '',
        nextOfKinRelationship: '',
        emergencyContact: '',
        emergencyPhone: '',
        emergencyRelationship: '',
        risk: 'low',
        status: 'new',
        conditions: [],
        allergies: [],
        hospitalisations: [],
        preferredLanguage: '',
        hearingImpairment: 'none',
        visionImpairment: 'none',
        mentalCapacity: 'full',
        hearingAids: false,
        glasses: false,
        pictureBoard: false,
        interpreter: false,
        communicationNotes: '',
        poaName: '',
        poaRelationship: '',
        poaPhone: '',
        consentDataSharing: false,
        consentFamilySharing: false,
        consentPhotoEvidence: false,
        consentNotes: '',
        wakeTime: '',
        bedTime: '',
        breakfastTime: '',
        lunchTime: '',
        dinnerTime: '',
        bathPreference: '',
        teaPreference: '',
        dietaryPreferences: '',
        culturalReligious: '',
        likes: '',
        dislikes: '',
        hobbies: '',
        dailyRoutine: '',
        personalHistory: '',
        familyBackground: '',
        whatMakesMeSmile: '',
        whatUpsetsMe: '',
        whatMattersToMe: '',
        lifeHistory: '',
        importantPeople: '',
        contacts: [],
        selectedCarers: [],
        medications: [],
        attachments: [],
      });
      setCurrentStep(1);
      setErrors({});
      onOpenChange(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientInfoStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return <MedicalHistoryStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <CommunicationStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PreferencesStep formData={formData} setFormData={setFormData} />;
      case 5:
        return (
          <KeyContactsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 6:
        return <LifeStoryStep formData={formData} setFormData={setFormData} />;
      case 7:
        return <MedicationsStep formData={formData} setFormData={setFormData} />;
      case 8:
        return (
          <AssignCarersStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 9:
        return <AttachmentsStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Patient
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {TOTAL_STEPS}
          </DialogDescription>
        </DialogHeader>

        <CreatePatientModalProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />

        <ScrollArea className="min-h-96 pr-4">{renderStep()}</ScrollArea>

        <CreatePatientModalFooter
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={handlePreviousStep}
          onNext={handleNextStep}
          onCreate={handleCreatePatient}
        />
      </DialogContent>
    </Dialog>
  );
}