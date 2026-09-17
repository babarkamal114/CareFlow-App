'use client';

import { useState } from 'react';
import {
  Input,
  Label,
  Button,
  Card,
  CardContent,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { X, Plus, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { PatientFormData } from './PatientCreateModal';


interface KeyContactsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

interface Contact {
  id: string;
  type: 'gp' | 'district-nurse' | 'social-worker' | 'pharmacist' | 'family' | 'other';
  name: string;
  role: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
  isEmergency: boolean;
}

export function KeyContactsStep({ formData, setFormData, errors, setErrors }: KeyContactsStepProps) {
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    type: 'family',
    name: '',
    role: '',
    phone: '',
    email: '',
    relationship: '',
    isPrimary: false,
    isEmergency: false,
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contacts = formData.contacts || [];
      setFormData({
        ...formData,
        contacts: [
          ...contacts,
          { ...newContact, id: Date.now().toString() },
        ],
      });
      setNewContact({
        type: 'family',
        name: '',
        role: '',
        phone: '',
        email: '',
        relationship: '',
        isPrimary: false,
        isEmergency: false,
      });
      if (errors.contacts) {
        setErrors({ ...errors, contacts: '' });
      }
    }
  };

  const handleRemoveContact = (id: string) => {
    setFormData({
      ...formData,
      contacts: (formData.contacts || []).filter((c: Contact) => c.id !== id),
    });
  };

  const contactTypeLabels: Record<Contact['type'], string> = {
    'gp': 'GP',
    'district-nurse': 'District Nurse',
    'social-worker': 'Social Worker',
    'pharmacist': 'Pharmacist',
    'family': 'Family Member',
    'other': 'Other',
  };

  const contactTypeIcons: Record<Contact['type'], React.ReactNode> = {
    'gp': <User className="h-4 w-4" />,
    'district-nurse': <User className="h-4 w-4" />,
    'social-worker': <User className="h-4 w-4" />,
    'pharmacist': <User className="h-4 w-4" />,
    'family': <User className="h-4 w-4" />,
    'other': <User className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Key Contacts</h3>
        <p className="text-sm text-cf-ink-60">Everyone involved in the patient's care</p>
      </div>

      {errors.contacts && (
        <div className="flex items-center gap-2 p-3 bg-[var(--cf-error-muted)] border border-[var(--cf-error)]/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-[var(--cf-error)] flex-shrink-0" />
          <p className="text-xs text-[var(--cf-error)]">{errors.contacts}</p>
        </div>
      )}

      <Card className="border-cf-border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Contact Type</Label>
            <Select
              value={newContact.type}
              onValueChange={(val) => setNewContact({ ...newContact, type: val as Contact['type'] })}
            >
              <SelectTrigger className="border-cf-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gp">GP</SelectItem>
                <SelectItem value="district-nurse">District Nurse</SelectItem>
                <SelectItem value="social-worker">Social Worker</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Name *</Label>
            <Input
              placeholder="Margaret Chen"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Role</Label>
            <Input
              placeholder="Daughter, Primary Carer"
              value={newContact.role}
              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Relationship</Label>
            <Input
              placeholder="Daughter"
              value={newContact.relationship || ''}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Phone *</Label>
            <Input
              placeholder="07700 900123"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Email</Label>
            <Input
              placeholder="margaret@email.com"
              value={newContact.email || ''}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPrimary"
              checked={newContact.isPrimary}
              onCheckedChange={(checked) => setNewContact({ ...newContact, isPrimary: checked as boolean })}
            />
            <Label htmlFor="isPrimary" className="text-xs font-normal cursor-pointer">
              Primary Contact
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isEmergency"
              checked={newContact.isEmergency}
              onCheckedChange={(checked) => setNewContact({ ...newContact, isEmergency: checked as boolean })}
            />
            <Label htmlFor="isEmergency" className="text-xs font-normal cursor-pointer">
              Emergency Contact
            </Label>
          </div>
        </div>

        <Button
          onClick={handleAddContact}
          variant="outline"
          size="sm"
          className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Contact
        </Button>
      </Card>

      {(formData.contacts || []).length > 0 && (
        <div className="space-y-2">
          {(formData.contacts || []).map((contact: Contact) => (
            <Card key={contact.id} className="border-cf-border p-3">
              <CardContent className="p-0 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {contactTypeIcons[contact.type]}
                    <p className="text-sm font-medium text-cf-ink">{contact.name}</p>
                    <span className="text-xs text-cf-ink-40">({contactTypeLabels[contact.type]})</span>
                    {contact.isPrimary && (
                      <span className="text-[10px] bg-[var(--cf-info-muted)] text-[var(--cf-info)] px-1.5 py-0.5 rounded-full">Primary</span>
                    )}
                    {contact.isEmergency && (
                      <span className="text-[10px] bg-[var(--cf-error-muted)] text-[var(--cf-error)] px-1.5 py-0.5 rounded-full">Emergency</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-cf-ink-60 mt-1">
                    {contact.role && <span>{contact.role}</span>}
                    {contact.relationship && <span>• {contact.relationship}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-cf-ink-60 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </span>
                    {contact.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-cf-ink-40 hover:text-cf-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}