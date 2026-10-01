import type { PatientContact, PatientFormData } from './patient-create';
import type { PatientFieldSection } from './patient-form-fields';

export type CreatePatientLifeStoryKey =
  | 'personalHistory'
  | 'familyBackground'
  | 'whatMakesMeSmile'
  | 'whatUpsetsMe'
  | 'whatMattersToMe'
  | 'lifeHistory'
  | 'importantPeople';

export const CREATE_PATIENT_LIFE_STORY_SECTIONS: PatientFieldSection<CreatePatientLifeStoryKey>[] = [
  {
    id: 'life-story',
    fields: [
      {
        kind: 'textarea',
        name: 'personalHistory',
        label: 'Personal History',
        placeholder: 'I was a primary school teacher for 35 years. I was born in Hong Kong and came to the UK in 1968...',
        minHeightClass: 'min-h-[100px]',
        hint: 'Who they were before retirement, their career, their background',
      },
      {
        kind: 'textarea',
        name: 'familyBackground',
        label: 'Family Background',
        placeholder: 'Married to Peter (deceased 2019), two children, three grandchildren...',
        minHeightClass: 'min-h-[80px]',
      },
      {
        kind: 'input',
        name: 'whatMakesMeSmile',
        label: 'What Makes Me Smile',
        placeholder: "My granddaughter's drawings, a good cup of tea, watching garden birds",
        type: 'text',
      },
      {
        kind: 'input',
        name: 'whatUpsetsMe',
        label: 'What Upsets Me',
        placeholder: 'Feeling rushed, people talking over me, not being able to garden',
        type: 'text',
      },
      {
        kind: 'input',
        name: 'whatMattersToMe',
        label: 'What Matters to Me',
        placeholder: 'Dignity, independence, staying in my own home, seeing my family',
        type: 'text',
      },
      {
        kind: 'textarea',
        name: 'lifeHistory',
        label: 'Life History (Full Story)',
        placeholder: "Write a fuller story of the patient's life...",
        minHeightClass: 'min-h-[120px]',
        hint: 'This will help carers understand the patient as a whole person',
      },
      {
        kind: 'input',
        name: 'importantPeople',
        label: 'Important People in My Life',
        placeholder: 'My daughter Margaret, my son James, my granddaughter Sophia, my friend Mrs. Patel',
        type: 'text',
      },
    ],
  },
];

export type CreatePatientPreferencesKey =
  | 'wakeTime'
  | 'bedTime'
  | 'breakfastTime'
  | 'lunchTime'
  | 'dinnerTime'
  | 'bathPreference'
  | 'teaPreference'
  | 'dietaryPreferences'
  | 'culturalReligious'
  | 'likes'
  | 'dislikes'
  | 'hobbies'
  | 'dailyRoutine';

export const CREATE_PATIENT_PREFERENCES_SECTIONS: PatientFieldSection<CreatePatientPreferencesKey>[] = [
  {
    id: 'routine',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'wakeTime', label: 'Wake Time', placeholder: '', type: 'time' },
      { kind: 'input', name: 'bedTime', label: 'Bed Time', placeholder: '', type: 'time' },
      { kind: 'input', name: 'breakfastTime', label: 'Breakfast Time', placeholder: '', type: 'time' },
      { kind: 'input', name: 'lunchTime', label: 'Lunch Time', placeholder: '', type: 'time' },
      { kind: 'input', name: 'dinnerTime', label: 'Dinner Time', placeholder: '', type: 'time' },
      { kind: 'input', name: 'bathPreference', label: 'Bath Preference', placeholder: 'Evening bath, prefers shower', type: 'text' },
    ],
  },
  {
    id: 'likes',
    fields: [
      { kind: 'input', name: 'teaPreference', label: 'Tea Preference', placeholder: "Builder's tea, one sugar, splash of milk", type: 'text' },
      { kind: 'input', name: 'dietaryPreferences', label: 'Dietary Preferences', placeholder: 'Vegetarian, likes fish, no spicy food', type: 'text' },
      { kind: 'input', name: 'culturalReligious', label: 'Cultural & Religious Needs', placeholder: 'Buddhist, no meat on full moon, needs meditation time', type: 'text' },
      { kind: 'input', name: 'likes', label: 'Likes', placeholder: 'Knitting, Radio 4, her granddaughter, watching birds', type: 'text' },
      { kind: 'input', name: 'dislikes', label: 'Dislikes', placeholder: 'Being rushed, people talking over her, fish', type: 'text' },
      { kind: 'input', name: 'hobbies', label: 'Hobbies & Interests', placeholder: 'Gardening, reading, knitting, listening to music', type: 'text' },
      {
        kind: 'textarea',
        name: 'dailyRoutine',
        label: 'Daily Routine Notes',
        placeholder: 'Likes to start the day with a cup of tea, prefers to dress before breakfast...',
        minHeightClass: 'min-h-[80px]',
      },
    ],
  },
];

export type ContactDraft = Omit<PatientContact, 'id'>;

export const CONTACT_TYPE_OPTIONS: { value: PatientContact['type']; label: string }[] = [
  { value: 'gp', label: 'GP' },
  { value: 'district-nurse', label: 'District Nurse' },
  { value: 'social-worker', label: 'Social Worker' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'family', label: 'Family Member' },
  { value: 'other', label: 'Other' },
];

export const CONTACT_TYPE_LABELS = Object.fromEntries(
  CONTACT_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<PatientContact['type'], string>;

export const EMPTY_CONTACT_DRAFT: ContactDraft = {
  type: 'family',
  name: '',
  role: '',
  phone: '',
  email: '',
  relationship: '',
  isPrimary: false,
  isEmergency: false,
};

export const CONTACT_DRAFT_FIELDS: {
  id: string;
  name: 'name' | 'role' | 'relationship' | 'phone' | 'email';
  label: string;
  placeholder: string;
}[] = [
  { id: 'contact-name', name: 'name', label: 'Name *', placeholder: 'Margaret Chen' },
  { id: 'contact-role', name: 'role', label: 'Role', placeholder: 'Daughter, Primary Carer' },
  { id: 'contact-relationship', name: 'relationship', label: 'Relationship', placeholder: 'Daughter' },
  { id: 'contact-phone', name: 'phone', label: 'Phone *', placeholder: '07700 900123' },
  { id: 'contact-email', name: 'email', label: 'Email', placeholder: 'margaret@email.com' },
];

export const CONTACT_FLAGS: {
  name: 'isPrimary' | 'isEmergency';
  id: string;
  label: string;
  badgeLabel: string;
  badgeClass: string;
}[] = [
  {
    name: 'isPrimary',
    id: 'isPrimary',
    label: 'Primary Contact',
    badgeLabel: 'Primary',
    badgeClass: 'text-[10px] bg-[var(--cf-info-muted)] text-[var(--cf-info)] px-1.5 py-0.5 rounded-full',
  },
  {
    name: 'isEmergency',
    id: 'isEmergency',
    label: 'Emergency Contact',
    badgeLabel: 'Emergency',
    badgeClass: 'text-[10px] bg-[var(--cf-error-muted)] text-[var(--cf-error)] px-1.5 py-0.5 rounded-full',
  },
];

export const canAddPatientContact = (draft: ContactDraft) => !!(draft.name && draft.phone);

export function addPatientContact(formData: PatientFormData, draft: ContactDraft): PatientFormData {
  return {
    ...formData,
    contacts: [...(formData.contacts || []), { ...draft, id: Date.now().toString() }],
  };
}

export function removePatientContact(formData: PatientFormData, id: string): PatientFormData {
  return {
    ...formData,
    contacts: (formData.contacts || []).filter((contact) => contact.id !== id),
  };
}