'use client';

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Checkbox
} from "@/components/ui"
import {
  AIDS,
  COMMUNICATION_SELECTS,
  CONSENT_OPTIONS,
  POA_FIELDS,
  getSelectValue,
} from 'utils';
import type { PatientFormData } from 'utils';

interface CommunicationStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function CommunicationStep({ formData, setFormData }: CommunicationStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Communication Needs</h3>
        <p className="text-sm text-cf-ink-60">How the patient communicates and their preferences</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preferredLanguage" className="text-sm font-medium">
            Preferred Language
          </Label>
          <Input
            id="preferredLanguage"
            name="preferredLanguage"
            placeholder="English, Urdu, Polish..."
            value={formData.preferredLanguage || ''}
            onChange={handleInputChange}
            className="border-cf-border"
          />
        </div>

        {COMMUNICATION_SELECTS.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
            </Label>
            <Select
              value={getSelectValue(formData, field)}
              onValueChange={(val) => handleSelectChange(field.name, val!)}
            >
              <SelectTrigger className="border-cf-border">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Communication Aids</Label>
        <div className="grid grid-cols-2 gap-2">
          {AIDS.map((aid) => (
            <div key={aid.key} className="flex items-center gap-2">
              <Checkbox
                id={aid.key}
                checked={formData[aid.key] || false}
                onCheckedChange={(checked) => handleCheckboxChange(aid.key, checked as boolean)}
              />
              <Label htmlFor={aid.key} className="text-sm font-normal cursor-pointer">
                {aid.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="communicationNotes" className="text-sm font-medium">
          Communication Notes
        </Label>
        <Textarea
          id="communicationNotes"
          name="communicationNotes"
          placeholder="Speak slowly and clearly, face the patient, use simple language..."
          value={formData.communicationNotes || ''}
          onChange={handleInputChange}
          className="border-cf-border min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-cf-ink">Power of Attorney</h4>
        <div className="grid grid-cols-3 gap-4">
          {POA_FIELDS.map((field) => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name} className="text-xs font-medium">
                {field.label}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-cf-ink">Consent Records</h4>
        <p className="text-xs text-cf-ink-60">
          What the patient has consented to sharing, and with whom
        </p>
        <div className="space-y-2">
          {CONSENT_OPTIONS.map((option) => (
            <div key={option.name} className="flex items-center gap-2">
              <Checkbox
                id={option.name}
                checked={formData[option.name] || false}
                onCheckedChange={(checked) => handleCheckboxChange(option.name, checked as boolean)}
              />
              <Label htmlFor={option.name} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        <div className="space-y-1 pt-1">
          <Label htmlFor="consentNotes" className="text-xs font-medium">
            Consent Notes
          </Label>
          <Textarea
            id="consentNotes"
            name="consentNotes"
            placeholder="Any limitations or specific conditions on consent..."
            value={formData.consentNotes || ''}
            onChange={handleInputChange}
            className="border-cf-border min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
}